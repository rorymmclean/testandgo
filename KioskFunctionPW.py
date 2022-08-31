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
    
    if operation == 'POST':
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
            myitems = body['Items'][0]
            if len(myitems) > 0:
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
                    'statuscode': '400',
                    'message': 'No records found',
                    }
        else:
            return {
                'statuscode': '400',
                'message': 'Please provide a Patient ID',
                }
    else:    
        return event
