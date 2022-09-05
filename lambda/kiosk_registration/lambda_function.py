from __future__ import print_function
import boto3
# import os
import json
from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr
import uuid
import hashlib
import datetime
import random

class DecimalEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Decimal):
       return str(obj)
    return json.JSONEncoder.default(self, obj)


# from_email = "jason.delano@aderas.com"
# config_set_name = os.environ["SES_CONFIG_SET_NAME"]
# client = boto3.client('ses')


def lambda_handler(event, context):
    # TODO implement
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('kiosk_patients')

    operation = event['context']['http-method']
    print(operation)
    
    print(event["params"]["querystring"])
    
    # Begin GET operations 
    if operation == 'GET':
        if ('identityType' in event["params"]["querystring"] and 'identityValue' in event["params"]["querystring"]):
            print('Got here params exist')
             
            # Determine type of lookup
            if event["params"]["querystring"]['identityType'] == 'Phone':
                myType = 'phone'
            elif event["params"]["querystring"]['identityType'] == 'Email':
                myType = 'email'
            else:
                myType = 'username'
            
            myValue = event["params"]["querystring"]['identityValue']

            # Determin type of data to return
            if event["params"]["querystring"]['dataRequest'] == 'guid':
                myData = 'patient_guid'
                myMessage = 'Patient Exists'
            elif event["params"]["querystring"]['dataRequest'] == 'code':
                myData = 'code'
                myMessage = 'Validation Code'
            else:
                myData = 'patient_guid' # for additional requests
                myMessage = 'Patient Exists'
                 
            print (myType, 'Lookup')
            body = table.scan(
                FilterExpression=Attr(myType).eq(myValue)
            )
            myitems = body['Items']
            print(len(myitems))
            if len(myitems) > 0:
                return {
                    'statuscode': '200',
                    'message': myMessage,
                    'body': myitems[0][myData],
                }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                }
    # End GET Operation

    if operation == 'POST':
        if ('identityType' in event["params"]["querystring"] and 'identityValue' in event["params"]["querystring"]):
            print('Got here params exist')

            myValue = event["params"]["querystring"]['identityValue']

            # Determine data to create new account with
            if event["params"]["querystring"]['identityType'] == 'Phone':
                myType = 'phone'
                myUpdate = {"phone": myValue}
            elif event["params"]["querystring"]['identityType'] == 'Email':
                myType = 'email'
                myUpdate = {"email": myValue}
            else:
                myType = 'username'
                myUpdate = {"username": myValue}

# Check that the record does not already exist

            body = table.scan(
                FilterExpression=Attr(myType).eq(myValue)
            )
            myitems = body['Items']
            print(len(myitems))
            if len(myitems) > 0:
                return {
                    'statuscode': '400',
                    'message': 'Duplicate Record',
                    'body': 'Item already exists, can not have duplicate email or phone for patient',
                }
            else:
                # Generate GUID
                myGuid = str(uuid.uuid4())
                # Generate Code
                myCode = random.randint(100000,999999)
            
                myPatient = {}
                myPatient.update({"patient_guid": myGuid})
                myPatient.update({"code": myCode})
                myPatient.update({"creation_date": datetime.datetime.now().isoformat(' ')})
                expiry = datetime.datetime.now() + datetime.timedelta(days=1)
                myPatient.update({"expiry_date": expiry.isoformat(' ')})

                myPatient.update(myUpdate)
        
                print (myPatient)
            
#            body_html = f"""<html>
#                <head></head>
#                <body>
#                <h2>Email from AWS SES!</h2>
#                <br/>
#                <p>This was sent from a Python Lambda using boto3</p> 
#                </body>
#                </html>
#                    """

#            email_message = {
#                'Body': {
#                    'Html': {
#                        'Charset': 'utf-8',
#                        'Data': body_html,
#                    },
#                },
#               'Subject': {
#                    'Charset': 'utf-8',
#                    'Data': "Hello from AWS SES",
#                },
#            }

#            ses_response = client.send_email(
#                Destination={
#                'ToAddresses': ['jason.delano@gmail.com'],
#                },
#            Message=email_message,
#            Source=from_email,
#            ConfigurationSetName=config_set_name,
#            )

#           print(f"ses response id received: {response['MessageId']}.")

            # Write Data to Dynamo and Capture Response
                response = table.put_item(Item=myPatient)
                if response["ResponseMetadata"]["HTTPStatusCode"] == 200:             
                    return {
                        'statuscode': '200',
                        'message': 'New Patient Created',
                        'body': {
                            'patient': myGuid,
                            'code': myCode,
                        },
                    }
                else:
                    return {
                        'statuscode': '400',
                        'message': 'Error',
                        'body': response,
                    }
    return {
        'statusCode': 200,
        'body': json.dumps(event["params"]["querystring"]['identityType'])
    }

