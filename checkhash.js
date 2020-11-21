'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.checkhash = (event, context, callback) => {

  var passwordhash = event.pathParameters.hash.toUpperCase();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      passwordhash: passwordhash,
    },
  };
  
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    var body;
    if(result.Item == null) {
      body = "{\"passwordhash\":\""+passwordhash+"\",\"timesseen\":0}"
    }
    else {
      body = JSON.stringify(result.Item)
    }

    // create a response
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: 
        body,
    };
    callback(null, response);
  });
};