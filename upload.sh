#!/bin/bash

[[ -z "$AWS_PROFILE" ]] && echo AWS_PROFILE is undefined && exit 1
[[ -z "$AWS_REGION" ]] && echo AWS_REGION is undefined && exit 1
[[ -z "$S3_BUCKET_NAME" ]] && echo S3_BUCKET_NAME is undefined && exit 1

aws --profile ${AWS_PROFILE} --region ${AWS_REGION} s3 cp $1 s3://${S3_BUCKET_NAME}
