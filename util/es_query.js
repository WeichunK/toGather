



// // const { Client } = require('@elastic/elasticsearch')
// // const client = new Client({ node: 'http://localhost:9200' })



// // https://${domain}/_search?q=%E5%A4%A7%E5%AE%89





// const { Client } = require("@opensearch-project/opensearch");
// let client = new Client({ node: `${domain}/_search?q=%E5%A4%A7%E5%AE%89` });
// const test_add_document = async () => {
//     let query = { query: { match: { title: { query: "大安", }, }, }, };
//     let response = await client.search({ index: "node-test", body: query, });
//     console.log("Searching:"); console.log(response.body);
// };

// test_add_document();





var AWS = require('aws-sdk');

require('dotenv').config();

const { AWS_ElASTIC_SEARCH_DOMAIN, AWS_ElASTIC_SEARCH_REGION } = process.env; // 30 days by seconds


var region = AWS_ElASTIC_SEARCH_REGION; // e.g. us-west-1
var domain = AWS_ElASTIC_SEARCH_DOMAIN; // e.g. search-domain.region.es.amazonaws.com
var index = 'node-togather';
var type = '_doc';

function queryDocument(keyword) {
    var endpoint = new AWS.Endpoint(domain);
    // console.log('endpoint', endpoint)
    var request = new AWS.HttpRequest(endpoint, region);
    // console.log('request', request)
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


    // let querySetting = JSON.stringify({
    //     "query": {
    //         "match": {
    //             "title": {
    //                 "query": "大安",
    //                 "unicode_aware": true,
    //                 //   "operator": "and",
    //                 "fuzziness": 1
    //             }
    //         }
    //     }
    // }
    // );

    // let querySetting = JSON.stringify(
    //     {
    //         "suggest": {
    //             "my-suggestion": {
    //                 "text": "大案",

    //                 "term": {
    //                     "suggest_mode": "popular",
    //                     "field": "title"
    //                 }
    //             }
    //         }
    //     }
    // )


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
                    ], "tie_breaker": 0
                }
            }
        })


    request.path += index + '/_search';

    // request.path += `_search??pretty -d '${querySetting}'`
    console.log('request.path 1', request.path)

    // request.path = encodeURI(request.path)
    // console.log('request.path', request.path)
    // request.body = JSON.stringify(document);
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
                // console.log('Response body: ' + responseBody);
                // result = JSON.parse(responseBody)
                // return result.json()

                // console.log('Response body: ' + responseBody);

                // console.log('Response type: ' + typeof responseBody);
                // console.log('Response body: JSON.parse' + JSON.parse(responseBody));

                result = JSON.parse(responseBody)
                // console.log('result length', result.hits.hits.length)

                // console.log('result.hits.hits[0]', result.hits.hits[0]._source.description)
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

    // for (let i in result.hits.hits) {
    //     console.log('result', result.hits.hits[i]._source.description)
    // }

    // console.log('result', result.hits.hits[0]._source.description)
    return result.hits;

}


// let keyword = "大安 羽球"

// gatheringQueryResult(keyword)


module.exports = {

    esSearch,
};

// {
//     "took": 12,
//         "timed_out": false,
//             "_shards": { "total": 5, "successful": 5, "skipped": 0, "failed": 0 },
//     "hits": {
//         "total": { "value": 4, "relation": "eq" },
//         "max_score": 8.648559,
//             "hits": [{
//                 "_index": "node-togather", "_type": "_doc", "_id": "BvVfPn0Bn1tmOyzUlv6O",
//                 "_score": 8.648559,
//                 "_source": { "id": 254, "title": "早上七點 －萬物復甦－我在大安羽球 天氣晴", "description": "天冷了 睡得不安穩 起來打球\n時間：10/30（六）早上7:00～9:00\n程度：初級 （基本接發ok，高手希望可以讓一下）\n人數：6人（含內建）\n球種：Volar V-50\n費用：100元。（球我負擔，這是場租均攤的費用）\n\n\n#註1：現場不要直銷、拍照、脫口罩燦笑 謝謝。\n#註2：臨時不能來記得說一下\n#註3：需自備球拍\n#註4：不負責男女比例，請保持基本禮儀～\n#註5：場租2小時為600元，有疑慮者可上大安運動中心官網查詢價格。", "picture": "https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/gathering/%E4%B8%8B%E8%BC%89+(1).jpeg", "lat": 25.0206263, "lng": 121.5457293, "name": "+how" }
//             },
//             {
//                 "_index": "node-togather", "_type": "_doc", "_id": "IvVfPn0Bn1tmOyzUlv6Y",
//                 "_score": 8.280848,
//                 "_source": { "id": 398, "title": "(已滿團)初階羽球練習 #新手友善", "description": "歡樂初階羽球局(非新手局）\n歡迎初階球友一起來同樂😁\n一般的高飛球要能打回去哇~\n\n我們程度大約在初階\n能多拍來回，少空拍\n天時地利人和能殺球\n比耐力的運動流汗局\n非技術型的認真比賽\n\n希望大家都是尊重友善包容的球友，尊重友善包容的正確打球態度是“打羽球是盡力求勝，但勝敗不在我心，享受過程大家開心\"\n不管實力強弱都希望每一個球友能盡量發揮到，依照對方實力調整回球難度(好打 難打 一步 兩步)。\n\n實際應用大約是\n盡量打到對方跑得到又不好接的地方\n具體表現大概是吊球跟快速球選一種\n吊球就打高一些\n平球就打人周圍\n讓人努力別讓人放棄🙏\n\n雙打四人上場\n全程需佩戴口罩\n報名請告知程度且知悉不殺球\n報名請告知程度且知悉不殺球\n報名請告知程度且知悉不殺球\n\n須自備拍子，或是向運動中心租借\n我有多一隻拍子可以借一個人🙋，請事先告知🙏🙏🙏\n\n中山運動中心\n104台北市中山區中山北路二段44巷2號\n三樓D場地 出電梯第一場\nhttps://maps.app.goo.gl/ErDi4rLRNAthFG6C7\n早上10-12二小時費用150/人\n早上9-12二小時費用200/人", "picture": "https://cdn.eatgether.com/meetup/e37fca18-96a9-4868-8f61-77311c0502d3/cover/6a58cfa4-96b2-47ba-8154-bebeaeaab759.jpg", "lat": 25.0549584, "lng": 121.5214854, "name": "joe" }
//             },
//             {
//                 "_index": "node-togather", "_type": "_doc", "_id": "UvVfPn0Bn1tmOyzUmf6O", "_score": 5.308201,
//                 "_source": { "id": 590, "title": "週四晚上劇本殺٩۹(๑•̀ω•́ ๑)۶#新手友善", "description": "11/25 星期四 19點~23點\n大橘為重\n角色：7人（尚缺3人）\n地點：靠過來-臺北市新生南路一段160巷18-1號1樓（捷運東門站6號出口）\n費用：$400/人\n\n會跟410號檔案室預約GM跟劇本~有興趣的小夥伴歡迎~~\n這是新手向劇本～喜歡小動物的小夥伴快來//\n\n\n劇本概要\n傳說中，在龐大的銀河系裡面，有眾多的星球，星球有大有小，今天的故事就發生在平平無奇、五顏六色，但是又充滿生機與活力的地球上！\n\n經研究表明，在地球這個奇怪星球上，生存著許多與我們不同的生物，其中有一種生物數量佔最多！我們統一稱他們為「憨瓜」。\n\n他們長著一個圓圓的腦袋，長到不太合理的四肢，而且他們還是站著行走的，總看起來不太聰明的樣子，甚至還總是幻想著要統治世界，結果到最後還是被我們奴役了！\n\n作為「咕咕特工隊」的成員，我們的目標就是保護世界！\n\n深奧點來說，就是用我們聰明的小腦袋，以及強到不能再強的動手能力，去搞一番作為！\n\n而你們就是「咕咕特工隊」位於大橘市分部的七位成員，將為組織作出巨大的貢獻⋯⋯\n\n可以審核請安心報名//", "picture": "https://cdn.eatgether.com/meetup/d61528b1-86f3-4417-8dc4-ff05f977749c/cover/9ecba64c-51b4-4616-9967-aa872e369b36.jpg", "lat": 25.0421407, "lng": 121.5198716, "name": "韓姜雪" }
//             },
//             {
//                 "_index": "node-togather", "_type": "_doc", "_id": "TvVfPn0Bn1tmOyzUmf6H", "_score": 5.252443,
//                 "_source": { "id": 611, "title": "11/14週日歡樂羽球 &另有教練場", "description": "\n⚠️報名審進聊天室內請出個聲歐\n\n⏰  11/14（日）時間：19:00-21:00\n    \n🚴‍♀️地點：仁愛國中 (近捷運忠孝敦化與信義安和)\n大安區仁愛路四段１３０號\n\n🏸 費用：$220(含球）\n用球：勝利藍蓋\n\n另有一面教練場(滿三人才開課) ,目前兩位報名\n上課一小時(19:00-20:00) 零打一小時\n本周為新手初階課程 詳細可依照個人待討論 報名教練課後如要取消需前一日告知\n四人團課每人$400 \n三人團課每人$500\n\n⚠️場地防疫辦法請仔細看⚠️\n仁愛國中防疫辦法：\n1. 進場需實名制 量體溫 手部消毒 並入場與下場休息時佩戴口罩\n 2. 進場需出示(警衛可能會檢查)\n      ➡️ 疫苗施打證明（小黃卡電子檔照片 或是正本 )\n      ➡️ 接種第一劑未滿14日或未接種者需出示：3日內快篩或ＰＲＣ檢測陰性證明（電子檔照片或正本） \n\n\n歡樂場須知：\n👉 有人在場上打球注意不要跨入場內\n👉 早到場可先上場拉球熱身，拉完直接開打\n👉App系統排場（跟磁鐵一樣），會唱名上場，確保大家上場公平\n👉盡量依程度區分，如需特別調整請“直接”告知場控～才知道您的需求哦\n\n⚠️有接觸史疑慮或身體不適或發燒者請在家休息歐\n\n若臨時突發狀況不能到場，也請提前2小時告知❤️", "picture": "https://cdn.eatgether.com/meetup/9ce00d60-0127-4124-8a09-c7f11daddf87/cover/ead66657-68b9-49dc-a332-9e2119452b5e.jpg", "lat": 25.0261583, "lng": 121.5427093, "name": "黏黏" }
//             }]
//     }
// }