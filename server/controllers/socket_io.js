const Chat = require('../models/chat_model');


const chat = function (io) {

    io.on('connection', (socket) => {
        console.log('a user connected!');
        socket.on('disconnect', () => {
            console.log('a user disconnected')
        })


        // socket.join("room-" + 1);
        // //Send this event to everyone in the room.
        // io.sockets.in("room-" + roomno).emit('connectToRoom', "You are in room no. " + roomno);



        // socket.on('addRoom', (room) => {
        //     socket.join(room)
        //     //(1)發送給在同一個 room 中除了自己外的 Client
        //     socket.to(room).emit('addRoom', '已有新人加入聊天室！')
        //     //(2)發送給在 room 中所有的 Client
        //     io.sockets.in(room).emit('addRoom', '已加入聊天室！')
        // })

        var chatLists = {}

        socket.on('addRoom', async roomInfo => {
            // check currently staying room
            let room = roomInfo.room
            const nowRoom = Object.keys(socket.rooms).find(room => {
                return room !== socket.id
            })
            // if yes, quite cirrent room
            if (nowRoom) {
                socket.leave(nowRoom)
            }
            // join new room
            socket.join(room)
            io.sockets.in(room).emit('addRoom', `有新人加入聊天室 ${room}！`)

            let result = await Chat.getChatRecord(room);
            // console.log('socket io result[0]', result)
            io.emit(`${room}+${roomInfo.userId}`, result)

            // if (chatLists[room]) {
            //     console.log('have message records')
            //     socket.emit('initialRoom', chatLists[room])
            // }


            socket.on('chat message', async (chat) => {
                console.log('meaasge: ' + chat.content);
                const result = await Chat.writeChatRecord(chat.roomId, chat.userId, chat.speaker, chat.content)

                // if (chatLists[room]) {
                //     chatLists[room].push(chat)
                // } else {
                //     chatLists[room] = [chat]
                // }

                // console.log('chatLists', chatLists)

                io.sockets.in(room).emit('chat message', chat);
            });
        })










        socket.on('addParticipant', async (participantData) => {



            console.log('participantData: ' + participantData);
            console.log('participantData.hostId', participantData.hostId)

            console.log('host_newparticipant_${participantData.hostId}', `host_newparticipant_${participantData.hostId}`)

            io.emit(`host_addParticipant_${participantData.hostId}`, participantData);
        });




        socket.on('removeParticipant', async (participantData) => {



            console.log('participantData: ' + participantData);
            console.log('participantData.hostId', participantData.hostId)

            console.log('host_quitParticipant_${participantData.hostId}', `host_quitParticipant_${participantData.hostId}`)

            io.emit(`host_removeParticipant_${participantData.hostId}`, participantData);
        });










    });

}


module.exports = {

    chat
};