
deploy_test_env:
	aws --profile admin --region us-east-1 cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./cloudformation.json --capabilities CAPABILITY_IAM --parameter-overrides BucketName=videosdr.ech.net FileName=VideoParams.csv DynamoDBTableName=VideoParams

what_went_wrong:
	aws --profile admin --region us-east-1 cloudformation describe-stack-events --stack-name csv-to-dynamo1

deploy_prod:
	aws --profile videosdr --region us-east-1 cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./cloudformation.json --capabilities CAPABILITY_IAM --parameter-overrides BucketName=data.videosdr.com FileName=VideoParams.csv DynamoDBTableName=VideoParams

upload:
	aws --profile admin --region us-east-1 s3 cp VideoParams.csv s3://videosdr.ech.net

upload_prod:
	aws --profile videosdr --region us-east-1 s3 cp VideoParams.csv s3://data.videosdr.com
