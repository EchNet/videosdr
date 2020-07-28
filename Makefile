dryrun:
	aws --profile admin --region us-east-1 cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./CloudFormation/CSVToDynamo.template --capabilities CAPABILITY_IAM --no-execute-changeset --parameter-overrides BucketName=videosdr.ech.net FileName=VideoParam.csv DynamoDBTableName=VideoParam

deploy:
	aws --profile admin --region us-east-1 cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./CloudFormation/CSVToDynamo.template --capabilities CAPABILITY_IAM --parameter-overrides BucketName=videosdr.ech.net FileName=VideoParam.csv DynamoDBTableName=VideoParam
