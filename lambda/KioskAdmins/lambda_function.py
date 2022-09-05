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
    table = dynamodb.Table('kiosk_admins')

    operation = event['context']['http-method']
    resource = event['context']['resource-path']
    
    if operation == 'GET' and resource == '/admin' :
        if 'admin' in event["params"]["querystring"]:
            myadmin = event["params"]["querystring"]['admin']
            body = table.query(
                KeyConditionExpression=Key('admin_guid').eq(myadmin)
            )
            myitems = body['Items']
            if len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'body': myitems
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    }
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a Admin ID',
                }
    elif operation == 'GET' and resource == '/admin/all' :
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
    elif operation == 'POST':
        myadmin = event["body-json"]
        if not (('password' in event["body-json"]) and ('email' in event["body-json"]) and 
                ('last_name' in event["body-json"]) and ('first_name' in event["body-json"]) and 
                ('role' in event["body-json"]) ):
            return {
                'statuscode': '400',
                'message': 'Please provide a first name, last_name, role, password, and email',
                }

        newguid = str(uuid.uuid4())
        myadmin.update({"admin_guid": newguid})
        pwhash = hashlib.md5(str(myadmin["password"]).encode())
        myadmin.update({"password": pwhash.hexdigest()})
        myadmin.update({"creation_date": datetime.datetime.now().isoformat(' ')})
        response = table.put_item(Item=myadmin)  
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return {
                'statuscode': '200',
                'message': 'Success',
                'body': {
                    'admin': newguid,
                    },
                }
        else:
            return {
                'statuscode': '400',
                'message': 'Error',
                'body': response,
                }
    elif operation == 'PUT':
        if 'admin' in event["params"]["querystring"]:
            myadmin = event["params"]["querystring"]['admin']
            newitems = event["body-json"]
            if 'password' in event["body-json"]:
                pwhash = hashlib.md5(str(newitems["password"]).encode())
                newitems.update({"password": pwhash.hexdigest()})
            body = table.query(
                KeyConditionExpression=Key('admin_guid').eq(myadmin)
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
