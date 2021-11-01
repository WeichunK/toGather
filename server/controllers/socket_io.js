


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

        socket.on('addRoom', room => {
            // check currently staying room
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

            if (chatLists[room]) {
                console.log('have message records')
                socket.emit('initialRoom', chatLists[room])
            }


            socket.on('chat message', (chat) => {
                console.log('meaasge: ' + chat.content);

                if (chatLists[room]) {
                    chatLists[room].push(chat)
                } else {
                    chatLists[room] = [chat]
                }

                console.log('chatLists', chatLists)

                io.sockets.in(room).emit('chat message', chat);
            });
        })





    });

}


module.exports = {

    chat
};