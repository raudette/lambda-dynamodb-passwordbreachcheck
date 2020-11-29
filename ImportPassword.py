# Modified from https://github.com/aws-samples/csv-to-dynamodb
# This function loads a CSV file from S3 and loads it into DynamoDB
import json
import boto3
import os
import csv
import codecs
import sys
from urllib.parse import unquote_plus

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')
bucket = os.environ['S3_BUCKET']
tableName = os.environ['DYNAMODB_TABLE']

def CSVtoDynamoDB(event, context):

   #get the file from S3
   try:
      for record in event['Records']:
         key = unquote_plus(record['s3']['object']['key'])
         print(key)
         obj = s3.Object(bucket, key).get()['Body']
   except Exception as e:
      print(e)

   try:
       table = dynamodb.Table(tableName)
   except Exception as e:
      print(e)

   batch_size = 100
   batch = []

   #process rows
   for row in csv.DictReader(codecs.getreader('utf-8')(obj),fieldnames=['passwordhash','timesseen'],delimiter=":"):
      if len(batch) >= batch_size:
         write_to_dynamo(batch)
         batch.clear()

      batch.append(row)

   if batch:
      write_to_dynamo(batch)

   return {
      'statusCode': 200,
      'body': json.dumps('Uploaded to DynamoDB Table')
   }


def write_to_dynamo(rows):
   try:
      table = dynamodb.Table(tableName)
   except:
      print("Error loading DynamoDB table. Check if table was created correctly and environment variable.")

   try:
      with table.batch_writer() as batch:
         for i in range(len(rows)):
            Item = {
                  'passwordhash': rows[i]["passwordhash"],
                  'timesseen':int(rows[i]["timesseen"])
            }
            #Load record into DB
            batch.put_item(Item)
            
   except Exception as e:
      print(e)