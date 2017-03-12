'use strict';
const openTableAccessToken = process.env.OPEN_TABLE_ACCESS_TOKEN;
const openTableHost = process.env.OPEN_TABLE_HOST;

//require('babel-register');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const request = require('request');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const DOM = React.DOM
const body = DOM.body
const div = DOM.div
//const script = DOM.script,
//const List = require('./List')
const App = React.createFactory(require('./App'))


module.exports.testServerRender = (event, context, callback) => {
    var props = {
        items: [
            'Item 0',
            'Item 1',
            'Item </scRIpt>\u2028',
            'Item <!--inject!-->\u2029',
        ]
    }
    var html = ReactDOMServer.renderToStaticMarkup(body(null,
        div({
            id: 'content',
            dangerouslySetInnerHTML: {
                __html: ReactDOMServer.renderToString(App(props))
            }
        })
    ))

    const slReponse = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body : html
    };

    callback(null, slReponse);
}

// module.exports.testServerRender2 = (event, context, callback) => {
//
//   var props = {
//       items: [
//           'Item 0',
//           'Item 1',
//           'Item </scRIpt>\u2028',
//           'Item <!--inject!-->\u2029',
//       ]
//   }
//
//   var html = ReactDOMServer.renderToStaticMarkup(<List items={props}/>)
//
//   const slReponse = {
//       statusCode: 200,
//       headers: {
//           'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//       },
//       body : html
//   };
//
//   callback(null, slReponse);
//
// }

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
    const finalEndpoint = "https://" + openTableHost + availabilityEndPoint

    var options = {
        url: finalEndpoint,
        headers: {
            'User-Agent': 'request',
            'Authorization': 'bearer ' + openTableAccessToken
        }
    };

    console.log('options:', options);

    request(options, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.

        const slReponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify({
                message: 'ot results!',
                data: body // eslint-disable-line
            }),
        };

        callback(null, slReponse);

    });
};

module.exports.saveUserFavorites = (event, contenxt, callback) => {

}

module.exports.listingsByName = (event, context, callback) => {

    console.log(event.queryStringParameters);

    const namePart = event.queryStringParameters.namePart;
    const listingEndPoint = "/sync/listings?name=" + namePart;
    const finalEndpoint = "https://" + openTableHost + listingEndPoint;

    const options = {
        url: finalEndpoint,
        headers: {
            'User-Agent': 'request',
            'Authorization': 'bearer ' + openTableAccessToken
        }
    };

    request(options, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //  console.log('body:', body); // Print the HTML for the Google homepage.

        const slReponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify({
                message: 'ot results!',
                data: body // eslint-disable-line
            }),
        };

        callback(null, slReponse);

    });

};

module.exports.listings = (event, context, callback) => {

    console.log(event.queryStringParameters);

    const region = event.queryStringParameters.region;

    if (typeof region === 'undefined') {
        const slReponse = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify({
                message: 'undefined parameter: region'
            }),
        };
        return callback(null, slReponse);
    }

    const listingEndPoint = "/sync/listings?region=" + region;
    const finalEndpoint = "https://" + openTableHost + listingEndPoint;
    const options = {
        url: finalEndpoint,
        headers: {
            'User-Agent': 'request',
            'Authorization': 'bearer ' + openTableAccessToken
        }
    };

    request(options, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //  console.log('body:', body); // Print the HTML for the Google homepage.



        const slReponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify({
                message: 'ot results!',
                data: body // eslint-disable-line
            }),
        };

        callback(null, slReponse);

    });

};


module.exports.getUsers = (event, context, callback) => {
    const params = {
        TableName: 'users'
    };
    dynamo.scan(params, (err, data) => {
        if (err) return callback(err);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                items: data.Items
            })
        };

        return callback(null, response);
    });
};

function safeStringify(obj) {
    return JSON.stringify(obj)
        .replace(/<\/(script)/ig, '<\\/$1')
        .replace(/<!--/g, '<\\!--')
        .replace(/\u2028/g, '\\u2028') // Only necessary if interpreting as JS, which we do
        .replace(/\u2029/g, '\\u2029') // Ditto
}
// module.exports.createUser = (event, context, callback) => {
//     const userData = JSON.parse(event.body);
//     const params = {

//     }

// };
