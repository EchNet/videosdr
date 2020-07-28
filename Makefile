
deploy_test_env:
	aws --profile admin --region us-east-1 cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./cloudformation.json --capabilities CAPABILITY_IAM --parameter-overrides BucketName=videosdr.ech.net FileName=VideoParam.csv DynamoDBTableName=VideoParams

what_went_wrong:
	aws --profile admin --region us-east-1 cloudformation describe-stack-events --stack-name csv-to-dynamo1

upload:
	aws --profile admin --region us-east-1 s3 cp VideoParam.csv s3://videosdr.ech.net
