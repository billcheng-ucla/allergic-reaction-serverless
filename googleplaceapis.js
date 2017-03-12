'use strict'
const googlePlaceKey = process.env.GOOGLE_PLACE_API_KEY
const googlePlaceHost = process.env.GOOGLE_PLACE_HOST
const targetLongitude = process.env.LONDON_LONGITUDE
const targetLatitude = process.env.LONDON_LATITUDE

const request = require('request');

module.exports.autocompleteSearch = (event, context, callback) => {

    console.log(event.queryStringParameters);

    const name = event.queryStringParameters.name;

    if (typeof name === 'undefined') {
        const slReponse = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify({
                message: 'undefined parameter: name'
            }),
        };
        return callback(null, slReponse);
    }

    const autoCompleteEndpint = "/autocomplete/json?"
    const finalEndpoint = googlePlaceHost + autoCompleteEndpint + "input=" + name + "&types=establishment&location="+ targetLongitude +","+ targetLatitude +"&radius=50&key=" + googlePlaceKey

    var options = {
        url: finalEndpoint,
        headers: {
            'User-Agent': 'request'
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
                message: 'google results!',
                data: body // eslint-disable-line
            }),
        };

        callback(null, slReponse);

    });
};
