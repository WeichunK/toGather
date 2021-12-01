const AWS = require('aws-sdk');
require('dotenv').config();
const { AWS_ElASTIC_SEARCH_DOMAIN, AWS_ElASTIC_SEARCH_REGION, AWS_ElASTIC_INDEX, AWS_ElASTIC_TYPE } = process.env;

var region = AWS_ElASTIC_SEARCH_DOMAIN;
var domain = AWS_ElASTIC_SEARCH_REGION;
var index = AWS_ElASTIC_INDEX;
var type = AWS_ElASTIC_TYPE;

const { pool } = require('../server/models/mysqlcon');

function indexDocument(document) {
    var endpoint = new AWS.Endpoint(domain);
    console.log('endpoint', endpoint)
    var request = new AWS.HttpRequest(endpoint, region);
    request.method = 'POST';
    // request.path += index + '/' + type + '/' + id;
    request.path += index + '/' + type;
    request.body = JSON.stringify(document);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Content-Length'] = Buffer.byteLength(request.body);
    // var credentials = new AWS.EnvironmentCredentials('AWS');
    var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
    AWS.config.credentials = credentials;
    var signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());
    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
        console.log(response.statusCode + ' ' + response.statusMessage);
        var responseBody = '';
        response.on('data', function (chunk) {
            responseBody += chunk;
        });
        response.on('end', function (chunk) {
            // console.log('Response body: ' + responseBody);
        });
    }, function (error) {
        console.log('Error: ' + error);
    });
}

async function getGathering() {
    let gathering;
    const gatheringQuery = 'SELECT g.id AS id, g.title AS title, description, g.picture AS picture, lat, lng,\
 m.name AS name from gathering g left join member m on g.host_id = m.id;'

    gathering = await pool.query(gatheringQuery);
    return gathering[0]
    // console.log(result[0].description)
}

async function buildIndex() {
    let data = await getGathering()
    let gathering
    for (let i in data) {
        gathering = {
            id: data[i].id,
            title: data[i].title,
            description: data[i].description,
            picture: data[i].picture,
            lat: data[i].lat,
            lng: data[i].lng,
            name: data[i].name
        }
        await indexDocument(gathering);
    }
    return;
}

buildIndex()


