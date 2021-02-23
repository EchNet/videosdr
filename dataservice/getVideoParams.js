'use strict';

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

exports.handler = async(event, ctx, callback) => {
  var params = {
     TableName: "VideoParams",
     KeyConditionExpression: '#key = :key',
     ExpressionAttributeValues: { ":key": event.key },
     ExpressionAttributeNames: { "#key": "key" }
  };
  const promise = new Promise(function(resolve, reject) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(data)
      }
    })
  })
  return promise;
};
