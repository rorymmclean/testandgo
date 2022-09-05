from __future__ import print_function
import boto3
import json
import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr
import uuid
import hashlib

class DecimalEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Decimal):
      return str(obj)
    return json.JSONEncoder.default(self, obj)


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('kiosk_cases')
    patient_table = dynamodb.Table('kiosk_patients')
    admin_table = dynamodb.Table('kiosk_admins')

    operation = event['context']['http-method']
    resource = event['context']['resource-path']
    
    if operation == 'GET' and resource == '/case/all' :
        if 'patient' in event["params"]["querystring"]:
            mypatient = event["params"]["querystring"]['patient']
            body = table.scan(
                FilterExpression=Attr('patient_guid').eq(mypatient)
            )
            myitems = body['Items']
            if len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'records': len(myitems),
                    'body': myitems,
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    }
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a Patient ID',
                }
    elif operation == 'GET' and resource == '/case' :
        if 'case' in event["params"]["querystring"]:
            mycase = event["params"]["querystring"]['case']
            body = table.query(
                KeyConditionExpression=Key('case_guid').eq(mycase)
            )
            myitems = body['Items']
            if len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'body': myitems,
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    }
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a Case ID',
                }
    elif operation == 'POST' and resource == '/case' :
        mycase = event["body-json"]
        if not (('patient_guid' in event["body-json"]) and ('test' in event["body-json"]) ):
            return {
                'statuscode': '401',
                'message': 'Please provide a patient_guid and test (type) in the payload',
                }
        body = patient_table.scan(
            FilterExpression=Attr('patient_guid').eq(mycase['patient_guid'])
            )
        myitems = body['Items']
        if len(myitems) < 1:
            return {
                'statuscode': '402',
                'message': 'Patient ID was not found',
                }
        newguid = str(uuid.uuid4())
        mycase.update({"case_guid": newguid})
        mycase.update({"school": str(body['Items'][0].get("school"))})
        mycase.update({"district": str(body['Items'][0].get("district"))})
        mycase.update({"creation_date": datetime.datetime.now().isoformat(' ')})
        response = table.put_item(Item=mycase)  
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return {
                'statuscode': '200',
                'message': 'Success',
                'body': {
                    'case': newguid,
                    },
                }
        else:
            return {
                'statuscode': '400',
                'message': 'Error',
                'body': response,
                }
    elif operation == 'POST' and resource == '/case/admin' :
        mycase = event["body-json"]
        if not (('admin_guid' in event["body-json"]) and ('test' in event["body-json"]) ):
            return {
                'statuscode': '401',
                'message': 'Please provide an admin_guid and test (type) in the payload',
                }
        body = admin_table.scan(
            FilterExpression=Attr('admin_guid').eq(mycase['admin_guid'])
            )
        myitems = body['Items']
        if len(myitems) < 1:
            return {
                'statuscode': '402',
                'message': 'Admin ID was not found',
                }
        newguid = str(uuid.uuid4())
        mycase.update({"case_guid": newguid})
        mycase.update({"patient_guid": mycase['admin_guid']})
        mycase.update({"creation_date": datetime.datetime.now().isoformat(' ')})
        response = table.put_item(Item=mycase)  
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return {
                'statuscode': '200',
                'message': 'Success',
                'body': {
                    'case': newguid,
                    },
                }
        else:
            return {
                'statuscode': '400',
                'message': 'Error',
                'body': response,
                }
    elif operation == 'PUT':
        if 'case' in event["params"]["querystring"]:
            mycase = event["params"]["querystring"]['case']
            newitems = event["body-json"]
            body = table.query(
                KeyConditionExpression=Key('case_guid').eq(mycase)
            )
            if len(body['Items']) > 0:
                olditems = body['Items'][0]
                for key in newitems:
                    olditems[key] = newitems[key]
                olditems.update({"update_date": datetime.datetime.now().isoformat(' ')})
                response = table.put_item(Item=olditems)
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'body': olditems,
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No record found',
                    }
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a Case ID',
                }

        return event
    else:    
        return event
