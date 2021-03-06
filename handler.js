'use strict';
const openTableAccessToken = process.env.OPEN_TABLE_ACCESS_TOKEN;
const openTableHost = process.env.OPEN_TABLE_HOST;
const targetLongitude = process.env.LONDON_LONGITUDE
const targetLatitude = process.env.LONDON_LATITUDE

//require('babel-register');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const request = require('request');
const uuid    = require('uuid');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const DOM = React.DOM
const body = DOM.body
const div = DOM.div
//const script = DOM.script,
//const List = require('./List')
const Card = React.createFactory(require('./restaurantCard'))


module.exports.testServerRender = (event, context, callback) => {
    let divs = '';
    const params = {
        TableName: 'restaurants'
    };
    dynamo.scan(params, (err, data) => {
        if (err) return callback(err);

        data.Items.forEach((item) => {
            divs += ReactDOMServer.renderToString(Card(item))
        });

        var html = ReactDOMServer.renderToStaticMarkup(
            div({
                id: 'content',
                dangerouslySetInnerHTML: {
                    __html: divs
                }
            })
        )

        const slReponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body : html
        };

        callback(null, slReponse);
    });
}

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

  //https://platform.otqa.com/availability?latitude=42.360082&longitude=71.058880&party_size=2&radius=200&forward_minutes=180&backward_minutes=30&start_date_time=2017-03-13T20%3A00&include_unavailable=true

    const availabilityEndPoint = "/availability?include_unavailable=true&latitude="+ targetLatitude +"&longitude="+ targetLongitude+"&radius=200&start_date_time=2017-03-29T18%3A00&party_size=2&forward_minutes=120&backward_minutes=30"
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
        //console.log('body:', body); // Print the HTML for the Google homepage.

        const slReponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: body
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

    const listingEndPoint = "/sync/listings";
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

        console.log(JSON.parse(body).items);
        body.items.forEach((item) => {
            const params = {
                TableName: 'restaurants',
                Item: {
                    id: uuid.v1(),
                    name: item.name,
                    rid: item.rid
                }
            };

            dynamo.put(params, (err, data) => {

            });
        });

        const slReponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: body
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

module.exports.getRestaurants = (event, context, callback) => {
    const params = {
        TableName: 'restaurants'
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

// module.exports.saveUserFavorite = (event, context, callback) => {
//     let userData = event.errorType ? null : JSON.parse(event.body);

//     if (!userData) {
//         callback(new Error('Improper body'));
//         return;
//     }
//
//     const params = {
//         // something
//         TableName: 'users',
//         Key: {
//             id: userData.user_id
//         },
//         Item: {
//             id: uuid.v1(),
//             user_id: userData.user_id,
//             r_id: userData.r_id
//         }
//     };

//     dynamo.put(params, (err, result) => {
//         if (err) {
//             callback(new Error(err));
//             return;
//         }
//         const response = {
//           statusCode: 200,
//           body: JSON.stringify(result.Attributes),
//         };

//         callback(null, response);
//     });
// };

// module.exports.saveUserFavorites = (event, context, callback) => {

// };

module.exports.getUserPromotions = (event, context, callback) => {
    let userData = event.errorType ? null : JSON.parse(event.body);

    if (!userData) {
        callback(new Error('Improper body'));
        return;
    }

    const params = {
        TableName: 'users',
        Key: {
          user_id: event.pathParameters.user_id
        }
    };

    dynamo.get(params, (err, data) => {
        if (err) {
            callback(new Error(err));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    });
};

// module.exports.removeUserFavorite = (event, context, callback) => {

// };

module.exports.createRestaurant = (event, context, callback) => {
    let userData = event.errorType || !event.body ? null : JSON.parse(event.body);

    if (!userData) {
        callback(new Error('Improper body'));
        return;
    }

    const params = {
        TableName: 'restaurants',
        Item: {
            id: uuid.v1(),
            name: userData.name,
            r_id: userData.r_id,
            promotion: userData.promotion ? userData.promotion : ''
        }
    };

    dynamo.put(params, (err, data) => {
        if (err) return callback(err);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                item: params.Item
            })
        };

        return callback(null, response);
    });
};

module.exports.createUser = (event, context, callback) => {
    let userData = event.errorType || !event.body ? null : JSON.parse(event.body);

    if (!userData) {
        callback(new Error('Improper body'));
        return;
    }

    const params = {
        TableName: 'users',
        Item: {
            id: uuid.v1(),
            email: userData.email,
            restaurants: []
        }
    };

    dynamo.put(params, (err, data) => {
        if (err) return callback(err);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                item: params.Item
            })
        };

        return callback(null, response);
    });
};
