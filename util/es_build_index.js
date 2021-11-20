const AWS = require('aws-sdk');
require('dotenv').config();
const { AWS_ElASTIC_SEARCH_DOMAIN, AWS_ElASTIC_SEARCH_REGION } = process.env; // 30 days by seconds


const region = AWS_ElASTIC_SEARCH_DOMAIN; // e.g. us-west-1
const domain = AWS_ElASTIC_SEARCH_REGION; // e.g. search-domain.region.es.amazonaws.com
const index = 'node-togather';
const type = '_doc';

const { pool } = require('../server/models/mysqlcon');

// var json = {
//     "id": 37,
//     "title": "評價4.7星的日式無菜單料理（午餐）",
//     "description": "當天早上台北出差，本來約好一起吃飯的朋友臨時不能來。這家店在我口袋名單已久，放棄訂位很可惜，想找人一起嘗試。\n\n☑️已訂位並付訂金。\n?含生食，如無法接受請別勉強。若有特定忌口食材可在報名理由說明。\n?我買單。若你介意想各付各的也行。\n?如審核通過，請勿遲到或臨時放鳥。\n\n可以相機先食，歡迎交換美食情報。報名理由請分享一家你喜歡的日式料理。\n\n看緣分，也可能不審核任何人，切莫放在心上。只要愛吃，都有機會見面?\n\n※照片取自店家FB：https://www.facebook.com/LongSushiOmakase/",
//     "category": "美食美酒",
//     "place": "235新北市中和區中山路三段60號",
//     "name": "哲哲",
//     "introduction": "在新竹工作，已婚。來這裡不是要找對象，可以輕鬆自在一點。\n\n偶爾只能一個人吃飯，有些想吃的餐廳無法找另一半一起吃，所以想在這找飯友。\n\n希望對方好聊、隨和，而且飲食愛好接近。吃飯時開心為主，平常要不要聯絡就隨緣，不強求。我的經驗是，有個生活圈不重疊的朋友，反而偶爾能敞開胸懷談心，不用顧慮太多。希望你是這樣的對象。\n\n怕生，在人多的場合會自動消音，所以想找兩人就好的聚會，才有餘裕認識對方。我會挑我喜歡的餐廳，可以由我付帳或各付各的，也歡迎推薦你的美食名單！\n\n最後，有幸一起吃飯的朋友，希望我們彼此守信、守時，抱著誠意、期待和空空的胃，共同享受美食吧！"
// }




// id, picture, lat, lng, title, description, name

function indexDocument(document) {
    const endpoint = new AWS.Endpoint(domain);
    // console.log('endpoint', endpoint)
    let request = new AWS.HttpRequest(endpoint, region);

    request.method = 'POST';
    // request.path += index + '/' + type + '/' + id;
    request.path += index + '/' + type;
    request.body = JSON.stringify(document);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Content-Length'] = Buffer.byteLength(request.body);

    // var credentials = new AWS.EnvironmentCredentials('AWS');

    const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
    AWS.config.credentials = credentials;

    let signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    let client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
        console.log(response.statusCode + ' ' + response.statusMessage);
        let responseBody = '';
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
    let result;

    const gatheringQuery = 'SELECT g.id AS id, g.title AS title, description, g.picture AS picture, lat, lng,\
 m.name AS name from gathering g left join member m on g.host_id = m.id;'

    result = await pool.query(gatheringQuery);

    result = result[0];

    return result
    // console.log(result[0].description)

}

async function buildIndex() {

    let data = await getGathering()

    let gathering

    // console.log(data[0].description)

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
        // console.log(gathering)

        await indexDocument(gathering);

    }

    console.log('finished')

    return;


}

buildIndex()



// indexDocument(json);

// function indexDocument(document) {
//     var endpoint = new AWS.Endpoint(domain);
//     console.log('endpoint', endpoint)
//     var request = new AWS.HttpRequest(endpoint, region);

//     request.method = 'POST';
//     // request.path += index + '/' + type + '/' + id;
//     request.path += index + '/' + type;
//     request.body = JSON.stringify(document);
//     request.headers['host'] = domain;
//     request.headers['Content-Type'] = 'application/json';
//     request.headers['Content-Length'] = Buffer.byteLength(request.body);

//     // var credentials = new AWS.EnvironmentCredentials('AWS');

//     var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
//     AWS.config.credentials = credentials;

//     var signer = new AWS.Signers.V4(request, 'es');
//     signer.addAuthorization(credentials, new Date());

//     var client = new AWS.HttpClient();
//     client.handleRequest(request, null, function (response) {
//         console.log(response.statusCode + ' ' + response.statusMessage);
//         var responseBody = '';
//         response.on('data', function (chunk) {
//             responseBody += chunk;
//         });
//         response.on('end', function (chunk) {
//             console.log('Response body: ' + responseBody);
//         });
//     }, function (error) {
//         console.log('Error: ' + error);
//     });
// }


