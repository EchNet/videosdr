import json
import boto3
import os
import csv
import codecs
import sys

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')

bucket = os.environ['bucket']
key = os.environ['key']
tableName = os.environ['table']


def lambda_handler(event, context):
  try:
    obj = s3.Object(bucket, key).get()['Body']
  except:
    print("S3 Object could not be opened. Check environment variable. ")
  try:
    table = dynamodb.Table(tableName)
  except:
    print("Error loading DynamoDB table.")

  batch_size = 100
  batch = []

  for row in csv.DictReader(codecs.getreader('utf-8')(obj)):
    if len(batch) >= batch_size:
      write_to_dynamo(batch)
      batch.clear()

    batch.append(row)

  if batch:
    write_to_dynamo(batch)

  return {'statusCode': 200, 'body': json.dumps('Uploaded to DynamoDB Table')}


def write_to_dynamo(rows):
  try:
    table = dynamodb.Table(tableName)
  except:
    print("Error loading DynamoDB table.")

  try:
    with table.batch_writer() as batch:
      for i in range(len(rows)):
        batch.put_item(Item=rows[i])
  except:
    print("Error executing batch_writer")
