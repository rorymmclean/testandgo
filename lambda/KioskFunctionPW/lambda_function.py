from __future__ import print_function
import boto3
import json
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
    table = dynamodb.Table('kiosk_patients')

    operation = event['context']['http-method']
    resource = event['context']['resource-path']

    
    if operation == 'POST' and resource == '/password':
        if not 'password' in event["body-json"] :
            return {
                'statuscode': '400',
                'message': 'Please provide a password',
                }
        
        if 'patient' in event["params"]["querystring"]:
            mypatient = event["params"]["querystring"]['patient']
            body = table.query(
                KeyConditionExpression=Key('patient_guid').eq(mypatient)
            )
            if len(body['Items']) > 0:
                myitems = body['Items'][0]
                oldpw = myitems['password']
                mypatient = event["body-json"]
                newpw = hashlib.md5(str(mypatient["password"]).encode()).hexdigest()
                if newpw == oldpw:
                    return {
                    'statuscode': '200',
                    'message': 'Success',
                    }
                else:
                    return {
                    'statuscode': '400',
                    'message': 'Failure',
                    }
            else:
                return {
                    'statuscode': '401',
                    'message': 'No records found',
                    }
    elif operation == 'GET' and resource == '/login':
        if ('loginid' in event["params"]["querystring"] and 'password' in event["params"]["querystring"]):
            print('Got here params exist')
            
            pwhash = hashlib.md5(str(event["params"]["querystring"]['password']).encode()).hexdigest()
            userid = event["params"]["querystring"]['loginid']
            
            body = table.scan(
                FilterExpression=( ( Attr('phone').eq(userid) | Attr('email').eq(userid) | Attr('username').eq(userid) ) & ( Attr('password').eq(pwhash) ) )
            )
            myitems = body['Items']
            print(len(myitems))
            if len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'body': myitems,
                }
            else:
                return {
                    'statuscode': '400',
                    'message': 'Failure',
                }
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a login ID and password to validate',
                }
    else:    
        return event
