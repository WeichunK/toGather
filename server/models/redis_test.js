
const { reject } = require('bcrypt/promises');
const redis = require('redis')
// const client = redis.createClient({ port: 6379, host: 'redis://redisforstylish.jqypcs.0001.apne1.cache.amazonaws.com' })
const client = redis.createClient(6379, 'redisforstylish.jqypcs.0001.apne1.cache.amazonaws.com', { no_ready_check: true })
const { pool } = require('./mysqlcon');


// redisClient.on("connection", () => {
//     console.log("redis connected");
// });

// redisClient.on("error", function (err) {
//     console.log("Error " + err);
// });

// redisClient.set('key1', 'value1', 'EX', 86400)


// const { createClient } = require('redis');

// (async () => {
//     const client = createClient({
//         url: 'redis://redisforstylish.jqypcs.0001.apne1.cache.amazonaws.com:6379'
//     });



//     client.on('error', (err) => console.log('Redis Client Error', err));

//     await client.connect();

//     await client.set('key', 'value');
//     const value = await client.get('key');
// })();



// async function sleep(n) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve()
//         }, n * 1000)
//     })
// }


async function insertGathering() {
    // await sleep(3)
    let result;
    const gatheringQuery = 'SELECT g.id AS id, g.title AS title, description, g.picture AS picture, lat, lng,\
 m.name AS name from gathering g left join member m on g.host_id = m.id;'

    result = await pool.query(gatheringQuery);
    result = result[0];



    // await redisClient.connect();
    // const client = createClient({
    //     url: 'redis://redisforstylish.jqypcs.0001.apne1.cache.amazonaws.com:6379'
    // });

    client.on('error', (err) => console.log('Redis Client Error', err));

    // await client.connect();

    let gatheringInRedis;
    let gathering;
    for (let i in result) {
        console.log(i)
        gathering = {
            id: result[i].id,
            title: result[i].title,
            description: result[i].description,
            picture: result[i].picture,
            lat: result[i].lat,
            lng: result[i].lng,
            name: result[i].name
        }



        await client.HSET('gathering', result[i].id, JSON.stringify(gathering), 'EX', 86400)
        // redisClient.expire(`gathering_${data[i].id}`, data[i].lng, data[i].id)
        await client.zadd('lat', parseFloat(result[i].lat), parseFloat(result[i].id))
        await client.zadd('lng', parseFloat(result[i].lng), parseFloat(result[i].id))

        // if (redisClient.HMGET(data[i].lat, data[i].lng)) {
        //     gatheringInRedis = await redisClient.HMGET(data[i].lat, data[i].lng)
        //     gatheringInRedis.push(gathering)
        //     redisClient.HMSET(data[i].lat, data[i].lng, gatheringInRedis)
        // } else {
        //     redisClient.HMSET(data[i].lat, data[i].lng, [gathering])
        // }





    }




}


// insertGathering()




// async function getGathering(key, start, end) {






//     // let result = client.ZRANGEBYSCORE(key, start, end).then((result) => { return result })

//     let result = await client.ZRANGEBYSCORE(key, start, end)
//     console.log('result0', result)

//     return result





// }



async function getGathering(key, start, end) {
    return new Promise(resolve => { // 重点


        client.ZRANGEBYSCORE(key, start, end, (err, result) => {


            if (err) {
                return reject(err)
            }
            return resolve(result); // 重点
        })
    })

}


async function getHASH(key, field) {
    return new Promise(resolve => { // 重点


        client.HMGET(key, field, (err, result) => {


            if (err) {
                return reject(err)
            }
            return resolve(result); // 重点
        })
    })

}

// -----------------------------
// const p = new Promise((resolve, reject) => {
//     client.ZRANGEBYSCORE('lat', 22.990375, 24.4929121, (err, result) => {


//         if (err) {
//             return reject(err)
//         }
//         return resolve(result); // 重点
//     })
// })
// p.then((lat) => {
//     console.log(Array.isArray(lat))
//     console.log('Object.prototype', Object.prototype.toString.call(lat))
//     console.log(lat[0])
// })
// --------------------------------

let lat = { start: 22.990375, end: 24.4929121 }
let lng = { start: 120.2, end: 120.7 }


async function getIndex(lat, lng) {


    let latList = await getGathering('lat', lat.start, lat.end).then(lat => {
        // console.log('resultLat', lat);
        // console.log(Array.isArray(lat))
        // // console.log([...lat])

        // console.log('Object.prototype', Object.prototype.toString.call(lat))
        return lat
    })

    let lngList = await getGathering('lng', lng.start, lng.end).then(lng => {
        // console.log('resultLat', lng);
        // console.log(Array.isArray(lng))
        // // console.log([...lat])

        // console.log('Object.prototype', Object.prototype.toString.call(lng))
        return lng
    })

    console.log('lat', latList)
    console.log('lng', lngList)

    let latSet = new Set(latList)
    let lngSet = new Set(lngList)

    let intersect = await latList.filter((e) => {
        return lngSet.has(e)
    })

    console.log('intersect', intersect)

    let result = await getHASH('gathering', [...intersect])
    console.log('result', typeof result)
    console.log('result', result)



}

getIndex(lat, lng)

// let lat = getGathering('lat', 22.990375, 24.4929121).then(lat => {
//     console.log('resultLat', lat);
//     console.log(Array.isArray(lat))
//     // console.log([...lat])

//     console.log('Object.prototype', Object.prototype.toString.call(lat))
//     return lat
// })

// console.log('lat', lat)





// console.log('keys', lat.length)

// let lng = getGathering('lng', 120.2, 120.7).then(result => {
//     console.log('resultlng', result);
//     return result
// })

// let intersect = new Set([...lat].filter(x => lng.has(x)));
// console.log(intersect);

// let intersection = lat.filter((e) => {
//     return lng.indexOf(e) > -1
// })

// console.log('intersection', intersection)

// let result = getGathering('lat', 22.990375, 24.4929121)
// console.log('result', result)

// result.then(function (result) {
//     console.log('result2', JSON.parse(result)) // "Some User token"
// })

// async function getResult() {
//     let result = await getGathering('lat', 22.990375, 24.4929121)
//     console.log('result', result)
//     for (let i in result) {
//         console.log('i', result[i])
//     }
// }



// getResult()



