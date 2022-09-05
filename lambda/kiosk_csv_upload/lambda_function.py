import json
import urllib.parse
import boto3
import codecs
import csv
import sys
from boto3.dynamodb.conditions import Key, Attr
import uuid
import os
import ssl
from botocore.exceptions import ClientError


print('Loading function')

s3 = boto3.client('s3')

def send_tag_email (myrecipient, mysubject,mymessage):
    myrecipient = "rory.mclean@aderas.com"
    SENDER = "rory.mclean@aderas.com"
    AWS_REGION = "us-west-2"
    BODY_HTML = """<html>
        <head></head>
        <body>
        <p>"""+mymessage+"""</p>
        </body>
        </html>
        """
    BODY_TEXT = ""
    CHARSET = "UTF-8"
    client = boto3.client('ses',region_name=AWS_REGION)
    try:
        response = client.send_email(
           Destination={
                'ToAddresses': [
                myrecipient,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': mysubject,
                },
            },
            Source=SENDER,
            # # If you are not using a configuration set, comment or delete the
            # # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
        
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent to "+myrecipient),
        print("Message ID: "+str(response['MessageId']))


def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    dynamodb = boto3.resource('dynamodb')

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print("CONTENT TYPE: " + response['ContentType'])
        csv_obj = s3.get_object(Bucket=bucket, Key=key)
        body = csv_obj['Body']
        lines = csv_obj['Body'].read().decode('utf-8').splitlines(True)
        reader = csv.DictReader(lines)
        #
        # Check Control Record
        table1 = dynamodb.Table('kiosk_uploads')
        body1 = table1.query(
            KeyConditionExpression=Key('file_key').eq(key)
            )
        if len(body1['Items']) < 1:
            print("Control record not found")
            return "No control record"
        else:
            myitems = body1['Items']
            myschool = myitems[0]['school']
            mydistrict = myitems[0]['district']
            mysubmitter_name = myitems[0]['submitter_name']
            mysubmitter_email = myitems[0]['submitter_email']
            mycreation = myitems[0]['creation_date']
            print(myitems)
        #
        # Check Columns
        csvfields = reader.fieldnames
        print(len(csvfields))
        if len(csvfields) < 3:
            print("Not enough columns")
            message_body = """<p>Your file was processed as was found to be lacking the three requisite columns; firstname, lastname, and guardian email./p>
                <p>Please update your file to the defined structure and resubmit.</p>
                <p>If you have any questions, you can contact Support at (xxx) xxx-xxxx</p>"""
            message_subject = "Failed Run of "+str(myschool)+" data load submitted "+str(mycreation)[:16]
            send_tag_email(myemail,message_subject,message_body)
            return "Not enough columns"
        message_insert = ""
        if csvfields[0].upper().count('FIRST') == 0 :
            print("Firstname column can't be identified")
            message_insert = message_insert + "<p>Column #1: Expected 'firstname' but found "+csvfields[0]+"</p>"
        if csvfields[1].upper().count('LAST') == 0 :
            print("Lastname column can't be identified.")
            message_insert = message_insert + "<p>Column #1: Expected 'lasttname' but found "+csvfields[1]+"</p>"
        if csvfields[2].upper().count('EMAIL') == 0 :
            print("Email column can't be identified")
            message_insert = message_insert + "<p>Column #1: Expected 'email' but found "+csvfields[2]+"</p>"
        if len(message_insert) > 0:
            message_body = """<p>Your file was processed as was found to be lacking atleast one of the requisite columns./p>"""+message_insert+"""
                <p>If you have any questions, you can contact Support at (xxx) xxx-xxxx</p>"""
            message_subject = "Failed Run of "+str(myschool)+" data load submitted "+str(mycreation)[:16]
            send_tag_email(myemail,message_subject,message_body)
            return "Not enough columns"
        print("Column headers validated")    
        #
        # Process Records
        table2 = dynamodb.Table('kiosk_patients')
        record_errors = ""
        records = 0
        guardians_new = 0
        guardians_exist = 0
        dependants_new = 0
        dependants_exist = 0
        for row in reader:
            records += 1
            print(records,"row",row)
            if row[csvfields[0]]:
                myfirstname = str(row[csvfields[0]])
            else:
                myfirstname = ""
            if row[csvfields[1]]:
                mylastname = str(row[csvfields[1]])
            else:
                mylastname = ""
            if row[csvfields[2]]:
                myemail = str(row[csvfields[2]])
            else:
                myemail = ""
            if ((len(myemail) > 0) or (len(myfirstname) > 0) or (len(mylastname) > 0)) :
                if len(myemail) > 0:
                    if len(myfirstname) > 0 and len(mylastname) > 0:
                        # Parent Records
                        body2 = table2.scan(
                            FilterExpression=Attr('email').eq(myemail)
                        )
                        myitems = body2['Items']
                        if len(myitems) > 0:
                            parent_guid = myitems[0]['patient_guid']
                            guardians_exist += 1
                        else:
                            mycase = {}
                            parent_guid = str(uuid.uuid4())
                            mycase.update({"patient_guid": parent_guid})
                            mycase.update({"creation_date": mycreation})
                            mycase.update({"email": myemail})
                            mycase.update({"school": myschool})
                            mycase.update({"district": mydistrict})
                            mycase.update({"source": key})
                            mycase.update({"project": 'NJ'})
                            response = table2.put_item(Item=mycase)  
                            guardians_new += 1 
                            message_body = """<p>This is the email that would have gone to the guardian at """+myemail+"""but in DEV this is blocked</p>
                                <p>The email would also include a link to https://testandgo.com/dev/preg?id="""+str(parent_guid)+"""</p>
                                <p>The link will allow the guardian to create their usernamne and password. 
                                The email would include other instructions like how to contact the help desk.</p>"""
                            message_subject = "Important Registration Information"
                            send_tag_email(myemail,message_subject,message_body)
                        # Dependants Records
                        body2 = table2.scan(
                            FilterExpression=Attr('first_name').eq(myfirstname) & 
                                    Attr('last_name').eq(mylastname) &
                                    Attr('guardians').contains(parent_guid)
                        )
                        if len(body2['Items']) > 0:
                            dependants_exist += 1
                        else:
                            mycase = {}
                            myguardians = [parent_guid]
                            dependants_guid = str(uuid.uuid4())
                            mycase.update({"patient_guid": dependants_guid})
                            mycase.update({"first_name": myfirstname})
                            mycase.update({"last_name": mylastname})
                            mycase.update({"creation_date": mycreation})
                            mycase.update({"guardians": myguardians})
                            mycase.update({"school": myschool})
                            mycase.update({"district": mydistrict})
                            mycase.update({"source": key})
                            mycase.update({"project": 'NJ'})
                            response = table2.put_item(Item=mycase)  
                            dependants_new += 1 
                    else:    
                        record_errors = record_errors + "Record #"+str(records)+" is missing either the first name or last name of the student.<br>"
                else:    
                    record_errors = record_errors + "Record #"+str(records)+" is missing a guardian email.<br>"
        message_body = "<p>This is the summary email that would have gone to "+mysubmitter_name+" @: "+mysubmitter_email+""" but in DEV this is blocked</p>
            <p>Ths summary information for this run is:<br>
            Total Records Processed: """+str(records)+"""<br>
            Total New Guardians Added: """+str(guardians_new)+"""<br>
            Total Existing Guardians Records: """+str(guardians_exist)+"""<br>
            Total New Studended Added: """+str(dependants_new)+"""<br>
            Total Existing Student Records: """+str(dependants_exist)+"</p>"
        if len(record_errors) > 0:
            message_body = message_body + "<br><br><u>Error Report</u><br>" + record_errors
        message_subject = "Run of "+str(myschool)+" data load submitted "+str(mycreation)[:16]
        send_tag_email(myemail,message_subject,message_body)
        print(message_body)
        return "complete"
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e