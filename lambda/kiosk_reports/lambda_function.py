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
    case_table = dynamodb.Table('kiosk_cases')
    patient_table = dynamodb.Table('kiosk_patients')
    admin_table = dynamodb.Table('kiosk_admins')

    operation = event['context']['http-method']
    resource = event['context']['resource-path']
    
    if operation == 'POST' and resource == '/reports/admins' :
        if 'schools' in event["body-json"]:
            myschools = event["body-json"]['schools']
            if 'days' in event["body-json"]:
                mydays = int(event["body-json"]['days'])
            else:
                mydays = 30
            from_date = (datetime.datetime.now() - datetime.timedelta(days=mydays)).isoformat(' ')

            response = case_table.scan(
                FilterExpression=Attr('school').is_in(myschools) & Attr('test_date').gte(from_date) & Attr('admin_guid').exists()
                )
                
            rec_cnt = len(response['Items'])    
            if rec_cnt > 0:    
                # sort decending order
                response = sorted(response['Items'], key=lambda k: (str(k.get('test_date',str(k.get('creation_date')))),str(k.get('patient_guid'))), reverse=True)

                for i in response:
                    response2 = admin_table.query(
                        KeyConditionExpression=Key('admin_guid').eq(i['admin_guid'])
                    )
                    i.update({'first_name': response2['Items'][0]['first_name']})
                    i.update({'last_name': response2['Items'][0]['last_name']})
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'record_count': rec_cnt,
                    'body': response
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found'
                    }
        
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a School Array'
                }

    elif operation == 'POST' and resource == '/reports/students' :
        if 'schools' in event["body-json"]:
            myschools = event["body-json"]['schools']
            if 'days' in event["body-json"]:
                mydays = int(event["body-json"]['days'])
            else:
                mydays = 30
            from_date = (datetime.datetime.now() - datetime.timedelta(days=mydays)).isoformat(' ')

            response = case_table.scan(
                FilterExpression=Attr('school').is_in(myschools) & Attr('test_date').gte(from_date) & Attr('admin_guid').not_exists()
                )
                
            rec_cnt = len(response['Items'])    
            if rec_cnt > 0:    
                # sort decending order
                response = sorted(response['Items'], key=lambda k: (str(k.get('test_date',str(k.get('creation_date')))),str(k.get('patient_guid'))), reverse=True)

                for i in response:
                    response2 = patient_table.query(
                        KeyConditionExpression=Key('patient_guid').eq(i['patient_guid'])
                    )
                    i.update({'first_name': response2['Items'][0]['first_name']})
                    i.update({'last_name': response2['Items'][0]['last_name']})
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'record_count': rec_cnt,
                    'body': response
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    }
        
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a School Array',
                }

    elif operation == 'GET' and resource == '/reports/students/all' :
        if 'days' in event["params"]["querystring"]:
            mydays = int(event["params"]["querystring"]['days'])
        else:
            mydays = 30
        from_date = (datetime.datetime.now() - datetime.timedelta(days=mydays)).isoformat(' ')

        response = case_table.scan(
            FilterExpression = Attr('test_date').gte(from_date) & Attr('admin_guid').not_exists()
            )
            
        rec_cnt = len(response['Items'])    
        if rec_cnt > 0:    
            # sort decending order
            response = sorted(response['Items'], key=lambda k: (str(k.get('test_date',str(k.get('creation_date')))),str(k.get('patient_guid'))), reverse=True)

            for i in response:
                response2 = patient_table.query(
                    KeyConditionExpression=Key('patient_guid').eq(i['patient_guid'])
                )
                i.update({'first_name': response2['Items'][0]['first_name']})
                i.update({'last_name': response2['Items'][0]['last_name']})
            return {
                'statuscode': '200',
                'message': 'Success',
                'record_count': rec_cnt,
                'body': response
                }
        else:
            return {
                'statuscode': '400',
                'message': 'No records found',
                }
        
    elif operation == 'GET' and resource == '/reports/admins/all' :
        if 'days' in event["params"]["querystring"]:
            mydays = int(event["params"]["querystring"]['days'])
        else:
            mydays = 30
        from_date = (datetime.datetime.now() - datetime.timedelta(days=mydays)).isoformat(' ')

        response = case_table.scan(
            FilterExpression = Attr('test_date').gte(from_date) & Attr('admin_guid').exists()
            )
            
        rec_cnt = len(response['Items'])    
        if rec_cnt > 0:    
            # sort decending order
            response = sorted(response['Items'], key=lambda k: (str(k.get('test_date',str(k.get('creation_date')))),str(k.get('patient_guid'))), reverse=True)

            for i in response:
                response2 = admin_table.query(
                    KeyConditionExpression=Key('admin_guid').eq(i['admin_guid'])
                )
                i.update({'first_name': response2['Items'][0]['first_name']})
                i.update({'last_name': response2['Items'][0]['last_name']})
            return {
                'statuscode': '200',
                'message': 'Success',
                'record_count': rec_cnt,
                'body': response
                }
        else:
            return {
                'statuscode': '400',
                'message': 'No records found',
                }

    elif operation == 'POST' and resource == '/reports/districts' :
        if 'districts' in event["body-json"]:
            mydistrict = event["body-json"]['districts']
            if 'days' in event["body-json"]:
                mydays = int(event["body-json"]['days'])
            else:
                mydays = 30
            from_date = (datetime.datetime.now() - datetime.timedelta(days=mydays)).isoformat(' ')

            response = case_table.scan(
                FilterExpression=Attr('district').is_in(mydistrict) & Attr('test_date').gte(from_date) & Attr('admin_guid').not_exists()
                )
                
            rec_cnt = len(response['Items'])    
            if rec_cnt > 0:    
                # sort decending order
                response = sorted(response['Items'], key=lambda k: (str(k.get('test_date',str(k.get('creation_date')))),str(k.get('patient_guid'))), reverse=True)

                for i in response:
                    response2 = patient_table.query(
                        KeyConditionExpression=Key('patient_guid').eq(i['patient_guid'])
                    )
                    i.update({'first_name': response2['Items'][0]['first_name']})
                    i.update({'last_name': response2['Items'][0]['last_name']})
                return {
                    'statuscode': '200',
                    'message': 'Success',
                    'record_count': rec_cnt,
                    'body': response
                    }
            else:
                return {
                    'statuscode': '400',
                    'message': 'No records found',
                    }
        
        else:
            return {
                'statuscode': '401',
                'message': 'Please provide a District Array',
                }


    else:    
        return event

        