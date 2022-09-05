from __future__ import print_function
import boto3
import json
from decimal import Decimal
import datetime
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
    table = dynamodb.Table('kiosk_patients')

    operation = event['context']['http-method']
    resource = event['context']['resource-path']
    
    if operation == 'GET' and resource == '/patient' :
        if 'patient' in event["params"]["querystring"]:
            mypatient = event["params"]["querystring"]['patient']
            body = table.query(
                KeyConditionExpression=Key('patient_guid').eq(mypatient)
            )
            myitems = body['Items']
            if len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    'body': myitems
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    }
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a Patient ID',
                'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                }
    elif operation == 'GET' and resource == '/patient/all' :
            body = table.scan(
                Limit = 1000
            )
            myitems = body['Items']
            if len(myitems) == 1000:
                return {
                    'statuscode': '201',
                    'message': 'Success but maximum items reached',
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    'body': myitems,
                    }
            elif len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    'body': myitems,
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    }
    elif operation == 'GET' and resource == '/preg' :
        if 'id' in event["params"]["querystring"]:
            myid = event["params"]["querystring"]['id']
            body = table.query(
                KeyConditionExpression=Key('patient_guid').eq(myid)
            )
            if len(body['Items']) > 0:
                myitems = body['Items']
                if 'password' in myitems[0] :
                    return {
                        'statuscode': '401',
                        'message': 'Login',
                        'headers': {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                        },
                        'body': myitems,
                    }
                elif len(myitems) > 0:
                    return {
                        'statuscode': '200',
                        'message': 'New Record',
                        'headers': {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                        },
                        'body': myitems,
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                }
        else:
            return {
                'statuscode': '402',
                'message': 'Please provide an ID value',
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
            }
    elif operation == 'POST':
        mypatient = event["body-json"]
        if not (('password' in event["body-json"]) and ('last_name' in event["body-json"]) and ('first_name' in event["body-json"]) and ('email' in event["body-json"]) ):
            return {
                'statuscode': '400',
                'message': 'Please provide a password, email, as well as first and last name',
                }

        newguid = str(uuid.uuid4())
        mypatient.update({"patient_guid": newguid})
        pwhash = hashlib.md5(str(mypatient["password"]).encode())
        mypatient.update({"password": pwhash.hexdigest()})
        mypatient.update({"creation_date": datetime.datetime.now().isoformat(' ')})
        response = table.put_item(Item=mypatient)  
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return {
                'statuscode': '200',
                'message': 'Success',
                'body': {
                    'patient': newguid,
                    },
                }
        else:
            return {
                'statuscode': '400',
                'message': 'Error',
                'body': response,
                }
    elif operation == 'PUT':
        if 'patient' in event["params"]["querystring"]:
            mypatient = event["params"]["querystring"]['patient']
            newitems = event["body-json"]
            if 'password' in event["body-json"]:
                pwhash = hashlib.md5(str(newitems["password"]).encode())
                newitems.update({"password": pwhash.hexdigest()})
            if 'expiry_date' not in event["body-json"]:
                newitems.update({"expiry_date": None})
            body = table.query(
                KeyConditionExpression=Key('patient_guid').eq(mypatient)
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
                'message': 'Please provide a Patient ID',
                }

        return event
    else:    
        return event
