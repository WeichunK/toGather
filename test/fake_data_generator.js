require('dotenv').config();
const { NODE_ENV } = process.env;
const bcrypt = require('bcrypt');
const {
    users,
    gatherings,
    participants,
} = require('./fake_data');
const { pool } = require('../server/models/mysqlcon');
const salt = parseInt(process.env.BCRYPT_SALT);

async function _createFakeUser(conn) {
    const encryped_users = users.map(user => {
        const encryped_user = {
            provider: user.provider,
            role_id: user.role_id,
            email: user.email,
            password: user.password ? bcrypt.hashSync(user.password, salt) : null,
            name: user.name,
            picture: user.picture,
            access_token: user.access_token,
            access_expired: user.access_expired,
            login_at: user.login_at
        };
        return encryped_user;
    });
    return await conn.query('INSERT INTO member (provider,role,email,password,name,popularity,picture,access_token,access_expired,login_at) VALUES ?', [encryped_users.map(x => Object.values(x))]);
}

async function _createFakeGathering(conn) {
    return await conn.query('INSERT INTO gathering (id,title,description,category,picture,host_id,start_at,created_at,max_participant,remaining_quota,place,lng,lat,email,name,host_pic,popularity,rating) VALUES ?', [gatherings.map(x => Object.values(x))]);
}

async function _createFakeParticipant(conn) {
    return await conn.query('INSERT INTO participant (gathering_id, participant_id, created_at) VALUES ?', [participants.map(x => Object.values(x))]);
}

async function createFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }
    const conn = await pool.getConnection();
    await conn.query('START TRANSACTION');
    await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
    await _createFakeUser(conn);
    await _createFakeGathering(conn);
    await _createFakeParticipant(conn);
    await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
    await conn.query('COMMIT');
    await conn.release();
}

async function truncateFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    const truncateTable = async (table) => {
        const conn = await pool.getConnection();
        await conn.query('START TRANSACTION');
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
        await conn.query(`TRUNCATE TABLE ${table}`);
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
        await conn.query('COMMIT');
        await conn.release();
        return;
    };

    const tables = ['member', 'gathering', 'participant'];
    for (let table of tables) {
        await truncateTable(table);
    }

    return;
}

async function closeConnection() {
    return await pool.end();
}

async function main() {
    await truncateFakeData();
    await createFakeData();
    await closeConnection();
}

// execute when called directly.
if (require.main === module) {
    main();
}

module.exports = {
    createFakeData,
    truncateFakeData,
    closeConnection,
};