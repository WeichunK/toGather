var AWS = require('aws-sdk');
require('dotenv').config();
const { AWS_ElASTIC_SEARCH_DOMAIN, AWS_ElASTIC_SEARCH_REGION } = process.env;

var region = AWS_ElASTIC_SEARCH_REGION;
var domain = AWS_ElASTIC_SEARCH_DOMAIN;
var index = 'node-togather';
var type = '_doc';

function queryDocument(keyword) {
    var endpoint = new AWS.Endpoint(domain);
    var request = new AWS.HttpRequest(endpoint, region);
    request.method = 'POST';
    // let querySetting = '{\
    //     "query": {\
    //         "match": {\
    //             "text": {\
    //                 "value": keyword\
    //             }\
    //         }\
    //     }\
    // })';

    // let querySetting = JSON.stringify({
    //     "query": {
    //         "fuzzy": {
    //             "title": {
    //                 "value": keyword
    //             }
    //         }
    //     }
    // });

    let querySetting = JSON.stringify(
        {
            "query": {
                "dis_max": {
                    "queries": [
                        {
                            "match": {
                                "title": {
                                    "query": keyword,
                                    "minimum_should_match": "80%"
                                }
                            }
                        },
                        {
                            "match": {
                                "description": {
                                    "query": keyword,
                                    "minimum_should_match": "80%"
                                }
                            }
                        }
                    ]
                    , "tie_breaker": 0
                }
            }
        })

    request.path += index + '/_search';
    // console.log('request.path 1', request.path)
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    request.body = querySetting;
    // console.log('request', request)
    // request.headers['Content-Length'] = Buffer.byteLength(request.body);
    var credentials = new AWS.EnvironmentCredentials('AWS');
    // var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
    AWS.config.credentials = credentials;
    var signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());
    var client = new AWS.HttpClient();

    return new Promise((resolve, reject) => {
        client.handleRequest(request, null, function (response) {
            // console.log(response.statusCode + ' ' + response.statusMessage);
            var responseBody = '';
            response.on('data', function (chunk) {
                responseBody += chunk;
            });
            let result
            response.on('end', function (chunk) {
                result = JSON.parse(responseBody)
                resolve(result)
            });
        }
            , function (error) {
                console.log('Error: ' + error);
            });
    })
}


async function esSearch(keyword) {
    let result = await queryDocument(keyword);
    return result.hits;

}

module.exports = { esSearch };
