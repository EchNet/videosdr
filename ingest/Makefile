build: build/cloudformation.json

build/cloudformation.json: cloudformation.dot s3ToDynamo.py
	mkdir -p build
	../tools/gencf cloudformation.dot > build/cloudformation.json

test:
	echo "No tests yet"

deploy: check-env build/cloudformation.json
	aws --profile ${AWS_PROFILE} --region ${AWS_REGION} cloudformation deploy --stack-name csv-to-dynamo1 --template-file ./build/cloudformation.json --capabilities CAPABILITY_IAM --parameter-overrides BucketName=${S3_BUCKET_NAME} DynamoDBTableName=VideoParams

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

logs: check-env
	aws --profile ${AWS_PROFILE} --region ${AWS_REGION} cloudformation describe-stack-events --stack-name csv-to-dynamo1

clean:
	rm -rf build
