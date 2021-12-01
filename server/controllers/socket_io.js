const Chat = require('../models/chat_model');

const chat = function (io) {
    io.on('connection', (socket) => {
        console.log('a user connected!');
        socket.on('disconnect', () => {
            console.log('a user disconnected')
        })

        socket.on('addRoom', async roomInfo => {
            // check currently staying room
            let room = roomInfo.room
            const nowRoom = Object.keys(socket.rooms).find(room => {
                return room !== socket.id
            })
            // if yes, quite current room
            if (nowRoom) {
                socket.leave(nowRoom)
            }
            // join new room
            socket.join(room)
            io.sockets.in(room).emit('addRoom', `有新人加入聊天室 ${room}！`)

            let chatRecord = await Chat.getChatRecord(room);

            io.emit(`${room}+${roomInfo.userId}`, chatRecord)

            socket.on('chat message', async (chat) => {
                console.log('meaasge: ' + chat.content);
                await Chat.writeChatRecord(chat.roomId, chat.userId, chat.speaker, chat.content)
                io.sockets.in(room).emit('chat message', chat);
            });
        })

        socket.on('addParticipant', async (participantData) => {
            // console.log('participantData: ' + participantData);
            // console.log('participantData.hostId', participantData.hostId)
            // console.log('host_newparticipant_${participantData.hostId}', `host_newparticipant_${participantData.hostId}`)
            let sysMessageContent = `${participantData.participantName} 剛加入您的 ${participantData.gatheringTitle} 活動`
            let sysMessage = { id: participantData.hostId, content: sysMessageContent }
            Chat.writeSystemRecord(sysMessage)
            // 通知host
            io.emit(`host_addParticipant_${participantData.hostId}`, participantData);
            // 通知聊天室user更新頁面
            // console.log(`all_changeParticipant_${participantData.gatheringId}_${participantData.participantId}`, `all_changeParticipant_${participantData.gatheringId}_${participantData.participantId}`)
            io.emit(`all_changeParticipant_${participantData.gatheringId}`, 'participant change');
        });

        socket.on('removeParticipant', async (participantData) => {
            // console.log('participantData: ' + participantData);
            // console.log('participantData.hostId', participantData.hostId)
            // console.log('host_quitParticipant_${participantData.hostId}', `host_quitParticipant_${participantData.hostId}`)
            let sysMessageContent = `${participantData.participantName} 剛退出您的 ${participantData.gatheringTitle} 活動`
            let sysMessage = { id: participantData.hostId, content: sysMessageContent }
            Chat.writeSystemRecord(sysMessage)
            // 通知host
            io.emit(`host_removeParticipant_${participantData.hostId}`, participantData);
            // 通知聊天室user更新頁面
            io.emit(`all_changeParticipant_${participantData.gatheringId}`, 'participant change');
        });

        socket.on('removeParticipantAdmin', async (participantData) => {
            // console.log('participantData: ' + participantData);
            // console.log('participantData.hostId', participantData.hostId)
            // console.log('host_quitParticipant_${participantData.hostId}', `host_quitParticipant_${participantData.hostId}`)
            let sysMessageContent = `${participantData.participantName} 已被移出 ${participantData.gatheringTitle} 活動`
            let sysMessage = { id: participantData.hostId, content: sysMessageContent }
            Chat.writeSystemRecord(sysMessage)
            // 通知聊天室user更新頁面
            io.emit(`all_changeParticipant_${participantData.gatheringId}`, 'participant change');
            // console.log('server: ', `all_changeParticipant_${participantData.gatheringId}_${participantData.participantId}`)
            io.emit(`all_changeParticipant_${participantData.gatheringId}_${participantData.participantId}`, 'participant change');
        });
    });
}

module.exports = { chat };