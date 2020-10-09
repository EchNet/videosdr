import json
import boto3
import os
import csv
import codecs
import urllib
import sys

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')
tableName = os.environ['table']


def lambda_handler(event, context):
  bucket = event["Records"][0]["s3"]["bucket"]["name"]
  key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"], encoding="utf-8")

  obj = s3.Object(bucket, key).get()['Body']

  batch_size = 100
  batch = []

  for row in csv.DictReader(codecs.getreader('utf-8')(obj)):
    row.pop("", None)  # Drop empty field names.
    if len(batch) >= batch_size:
      write_to_dynamo(batch)
      batch.clear()
    batch.append(row)

  if batch:
    write_to_dynamo(batch)

  return "Uploaded to DynamoDB Table"


def write_to_dynamo(rows):
  table = dynamodb.Table(tableName)
  with table.batch_writer() as batch:
    for i in range(len(rows)):
      batch.put_item(Item=rows[i])
