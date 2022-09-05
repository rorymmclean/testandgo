from __future__ import print_function
import json
import base64
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr
import uuid
import hashlib
import datetime

bucket_name = 'aderas-kiosk-uploads'

def lambda_handler(event, context):
    operation = event['context']['http-method']
    resource = event['context']['resource-path']
    
    if operation == 'POST' and resource == '/upload':    
        print("1) Start of upload function")
    
        ct = datetime.datetime.now()
        ctstr = ct.strftime("%Y%m%d%H%M%S")
        
        if 'school' in event["params"]["querystring"]:
            myschool = event["params"]["querystring"]['school']
            tightschool = myschool
            for character in " _'":
                tightschool = tightschool.replace(character, '')
        else:
            return {
                'statuscode': '400',
                'message': 'Missing School Parameter',
            }
        if 'district' in event["params"]["querystring"]:
            mydistrict = event["params"]["querystring"]['district']
        else:
            return {
                'statuscode': '400',
                'message': 'Missing District Parameter',
            }
        if 'submitter_name' in event["params"]["querystring"]:
            mysubmitter = event["params"]["querystring"]['submitter_name']
        else:
            return {
                'statuscode': '400',
                'message': 'Missing Submitter Name',
            }
        if 'submitter_email' in event["params"]["querystring"]:
            myemail = event["params"]["querystring"]['submitter_email']
        else:
            return {
                'statuscode': '400',
                'message': 'Missing Submitter Email',
            }
        file_content = base64.b64decode(event['content'])
        file_path = tightschool+'_'+ctstr+".csv"
        
        s3 = boto3.client('s3')
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('kiosk_uploads')
        
        print('2) Finished Extracts')
        
        mypayload = {}
        mypayload.update({"file_key": file_path})
        mypayload.update({"school": myschool })
        mypayload.update({"district": mydistrict })
        mypayload.update({"submitter_name": mysubmitter })
        mypayload.update({"submitter_email": myemail })
        mypayload.update({"creation_date": ct.isoformat(' ')})
        response = table.put_item(Item=mypayload)  
        print('3) Created DynamoDB Record')
        
        
        try:
            s3_response = s3.put_object(Bucket=bucket_name, Key=file_path, Body=file_content)
        except Exception as e:
            raise IOError(e)
            
        print("4) Saved "+file_path) 
        
        return {
            'statusCode': 200,
            'body': {
                'file_path': file_path
            }
        }
        
    else:
        return event