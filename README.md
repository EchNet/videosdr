
CloudFormation template CSVToDynamo.template

Listens for uploads to a specific file in a specific S3 bucket and loads the contents of that file into a DynamoDB table.

The file must be in CSV format.  The first line of the file contains headers.  The first header must be uuid and the contents of this column must contain unique keys for each row.  The remaining headers and column data are arbitrary.

Required Parameters:

BucketName          The name of the S3 bucket (Do not create the bucket, let CloudFormation do it.)
FileName            The name of the file in the bucket to watch for uploads.
DynamoDBTableName   The name of the DynamoDB table (Let CloudFormation create it)
