'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//This function is the checkhash webservice
module.exports.checkhash = (event, context, callback) => {

  var passwordhash = event.pathParameters.hash.toUpperCase();

  //Set the search parameter
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      passwordhash: passwordhash,
    },
  };
  
  //Execute the search
  dynamoDb.get(params, (error, result) => {
    
    //Error
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Error',
      });
      return;
    }

    //Create the response payload
    var body;
    //No match found
    if(result.Item == null) {
      body = "{\"passwordhash\":\""+passwordhash+"\",\"timesseen\":0}"
    }
    //Match found
    else {
      body = JSON.stringify(result.Item)
    }

    //Send the response
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