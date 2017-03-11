'use strict';
const openTableAccessToken = process.env.OPEN_TABLE_ACCESS_TOKEN;
const openTableHost = process.env.OPEN_TABLE_HOST;

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.availability = (event, context, callback) => {

  const availabilityEndPoint = "/availability/334879?start_date_time=2017-03-29T18%3A00&party_size=2&forward_minutes=120&backward_minutes=30"

  const finalEndpoint = "http://" + openTableHost + availabilityEndPoint;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
