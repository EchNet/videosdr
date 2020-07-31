default: formation

check-env:
ifndef AWS_PROFILE
	$(error AWS_PROFILE is undefined)
endif
ifndef AWS_REGION
	$(error AWS_REGION is undefined)
endif
ifndef S3_BUCKET_NAME
	$(error S3_BUCKET_NAME is undefined)
endif

build/s3ToDynamo.py.jsa: src/s3ToDynamo.py
	node tojsa.js src/s3ToDynamo.py > build/s3ToDynamo.py.jsa

build/cloudformation.json: cloudformation.dot build/s3ToDynamo.py.jsa
	node -r fs -e 'console.log(JSON.stringify(JSON.parse(require("dot").template(fs.readFileSync("cloudformation.dot", "utf-8"))({})), null, 4));' > build/cloudformation.json

formation: check-env build/cloudformation.json
	aws --profile ${AWS_PROFILE} --region ${AWS_REGION} cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./build/cloudformation.json --capabilities CAPABILITY_IAM --parameter-overrides BucketName=${S3_BUCKET_NAME} DynamoDBTableName=VideoParams

logs:
	aws --profile ${AWS_PROFILE} --region ${AWS_REGION} cloudformation describe-stack-events --stack-name csv-to-dynamo1

upload_data:
	(cd csv; aws --profile ${AWS_PROFILE} --region ${AWS_REGION} s3 cp VideoParams.csv s3://${S3_BUCKET_NAME})
	(cd csv; aws --profile ${AWS_PROFILE} --region ${AWS_REGION} s3 cp VideoParams1.csv s3://${S3_BUCKET_NAME})
