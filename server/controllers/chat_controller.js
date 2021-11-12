const Chat = require('../models/chat_model');

const writeChatRecord = async (req, res) => {

    const { roomId, userId, content } = req.body;

    const result = await Chat.writeChatRecord(roomId, userId, content)
    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    res.status(200).send({
        message: 'inserted successfully'
    })
    return;
}


const getChatRecord = async (req, res) => {

    const roomId = req.params.roomId;



    console.log('roomId', req.params.roomId)
    let result = await Chat.getChatRecord(roomId);

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        res.status(status_code).send({ error: result.error });
        return;
    }


    res.status(200).send({ data: result });
    return;
}




const writeSystemRecord = async (req, res) => {


    let sysMessage = { id: req.user.id, content: req.body.content }

    console.log('sysMessage', sysMessage)
    const result = await Chat.writeSystemRecord(sysMessage)
    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    res.status(200).send({
        message: 'inserted successfully'
    })
    return;
}


const getSystemRecord = async (req, res) => {

    const userId = req.user.id;

    console.log('userId', userId)
    let result = await Chat.getSystemRecord(userId);

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        res.status(status_code).send({ error: result.error });
        return;
    }


    res.status(200).send({ data: result });
    return;
}







module.exports = { writeChatRecord, getChatRecord, writeSystemRecord, getSystemRecord }