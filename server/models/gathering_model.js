const { pool } = require('./mysqlcon');

// const express = require('express');
// const app = express();

// // const app = require('../../app')
// const http = require('http');
// // const server = http.createServer(app);


// const server = require('../../app')
// const { Server } = require("socket.io");
// // const io = new Server(server);


// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     }
// });

const { io } = require("../../app")


const getGatherings = async (pageSize, paging = 0, requirement = {}) => {
    // const conn = await pool.getConnection();
    let result;
    const condition = { sql: '', binding: [], order: '' };
    if (requirement.keyword != null) {
        condition.sql = 'WHERE title LIKE ?';
        condition.binding = [`%${requirement.keyword}%`];
        condition.order = 'ORDER BY created_at DESC;'
    } else if (requirement.boundary != null) {
        condition.sql = 'WHERE lng BETWEEN ? AND ? AND lat BETWEEN ? AND ?';
        condition.binding = requirement.boundary;
        condition.order = 'ORDER BY created_at DESC;'

    } else if (requirement.id != null) {
        condition.sql = 'WHERE id = ?';
        condition.binding = [requirement.id];
        condition.order = ';'
    }


    const gatheringQuery = 'SELECT * FROM gathering ' + condition.sql + condition.order;

    result = await pool.query(gatheringQuery, condition.binding);

    return result[0];

    // try {
    //     // await conn.query('START TRANSACTION');
    //     // const [result] = await conn.query('INSERT INTO product SET ?', product);
    //     // await conn.query('INSERT INTO variant(product_id, color_id, size, stock) VALUES ?', [variants]);
    //     // await conn.query('INSERT INTO product_images(product_id, image) VALUES ?', [images]);
    //     // await conn.query('COMMIT');
    //     if (Hbg) {
    //         console.log('model query', Hbg, Hbi, tcg, tci)
    //         let binding = [Hbg, Hbi, tcg, tci]
    //         result = await conn.query('select * from gathering where lng between ? AND ? AND lat between ? and ?;', binding)
    //     } else {
    //         result = await conn.query('select * from gathering')
    //     }
    //     console.log('result', result[0])



    //     return result[0];
    // } catch (error) {
    //     await conn.query('ROLLBACK');
    //     console.log(error)
    //     return -1;
    // } finally {
    //     await conn.release();
    // }
};

// const getGatheringDetail = async (gatheringId) => {

//     try {

//         const [gathering] = await pool.query('SELECT * FROM member_2 WHERE id = ?', [gatheringId]);
//         console.log('users[0] ', gathering[0])
//         return gathering[0];

//     } catch (e) {
//         return null;
//     }

// }

const hostGathering = async (gathering) => {


    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');

        gathering.created_at = new Date();
        gathering.status = 1;

        const queryStr = 'INSERT INTO gathering SET ?';
        const [result] = await conn.query(queryStr, gathering);

        // gathering.id = result.insertId;
        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        // io.emit('updateGatheringList', 'DB updated');
        await conn.release();

    }

}


const joinGathering = async (participant) => {

    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');

        participant.created_at = new Date();


        const queryStr = 'INSERT INTO participant SET ?';
        const [result] = await conn.query(queryStr, participant);

        // gathering.id = result.insertId;
        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        // io.emit('updateGatheringList', 'DB updated');
        await conn.release();

    }




}



module.exports = {
    getGatherings,
    // getGatheringDetail,
    hostGathering,
    joinGathering,
    // getHotProducts,
    // getProductsVariants,
    // getProductsImages,
};