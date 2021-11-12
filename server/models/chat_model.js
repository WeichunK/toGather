const { pool } = require('./mysqlcon');


const writeChatRecord = async (roomId, userId, userName, content) => {

    let chat = {}

    chat.room_id = roomId;
    chat.user_id = userId;
    chat.user_name = userName;
    chat.content = content;

    chat.created_at = new Date();

    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');

        chat.created_at = new Date();


        const queryStr = 'INSERT INTO chat_record SET ?';
        const [result] = await conn.query(queryStr, chat);


        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {

        await conn.release();

    }




}


const getChatRecord = async (roomId) => {
    // const conn = await pool.getConnection();
    let result;



    const gatheringQuery = 'SELECT * FROM chat_record where room_id =? order by created_at';

    result = await pool.query(gatheringQuery, roomId);

    return result[0];


};







const writeSystemRecord = async (sysMessage) => {


    sysMessage.created_at = new Date();

    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');

        const queryStr = 'INSERT INTO system_message_record SET ?';
        const [result] = await conn.query(queryStr, sysMessage);

        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {

        await conn.release();

    }




}


const getSystemRecord = async (userId) => {
    // const conn = await pool.getConnection();
    let result;



    const gatheringQuery = 'SELECT * FROM system_message_record where id =? order by created_at';

    result = await pool.query(gatheringQuery, userId);

    return result[0];


};





module.exports = {
    writeChatRecord,
    getChatRecord,
    writeSystemRecord,
    getSystemRecord,
};