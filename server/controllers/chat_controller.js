const Chat = require('../models/chat_model');

const writeChatRecord = async (req, res) => {
    const { roomId, userId, content } = req.body;
    const writeChatRecordResult = await Chat.writeChatRecord(roomId, userId, content)
    if (writeChatRecordResult.error) {
        res.status(403).send({ error: writeChatRecordResult.error });
        return;
    }
    res.status(200).send({
        message: 'inserted successfully'
    })
    return;
}

const getChatRecord = async (req, res) => {
    const roomId = req.params.roomId;
    // console.log('roomId', req.params.roomId)
    let getChatRecordResult = await Chat.getChatRecord(roomId);
    if (getChatRecordResult.error) {
        const status_code = getChatRecordResult.status ? getChatRecordResult.status : 403;
        res.status(status_code).send({ error: getChatRecordResult.error });
        return;
    }
    res.status(200).send({ data: getChatRecordResult });
    return;
}

const writeSystemRecord = async (req, res) => {
    let sysMessage = { id: req.user.id, content: req.body.content }
    // console.log('sysMessage', sysMessage)
    const writeSystemRecordResult = await Chat.writeSystemRecord(sysMessage)
    if (writeSystemRecordResult.error) {
        res.status(403).send({ error: writeSystemRecordResult.error });
        return;
    }
    res.status(200).send({
        message: 'inserted successfully'
    })
    return;
}

const getSystemRecord = async (req, res) => {
    const userId = req.user.id;
    // console.log('userId', userId)
    let getSystemRecordResult = await Chat.getSystemRecord(userId);
    if (getSystemRecordResult.error) {
        const status_code = getSystemRecordResult.status ? getSystemRecordResult.status : 403;
        res.status(status_code).send({ error: getSystemRecordResult.error });
        return;
    }
    res.status(200).send({ data: getSystemRecordResult });
    return;
}

module.exports = { writeChatRecord, getChatRecord, writeSystemRecord, getSystemRecord }