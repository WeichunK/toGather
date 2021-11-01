const express = require('express');

const app = express();
const cors = require('cors');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const { PORT, API_VERSION } = process.env;
const port = PORT
app.use(cors());

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { chat } = require('./server/controllers/socket_io')

// API routes
app.use('/api/' + API_VERSION,
    // rateLimiterRoute,
    [
        require('./server/routes/gathering_route'),
        // require('./server/routes/admin_route'),
        // require('./server/routes/product_route'),
        // require('./server/routes/marketing_route'),
        require('./server/routes/user_route'),
        // require('./server/routes/order_route'),
    ]
);


chat(io);



// io.on('connection', (socket) => {
//     console.log('a user connected!');
//     socket.on('disconnect', () => {
//         console.log('a user disconnected')
//     })


//     // socket.join("room-" + 1);
//     // //Send this event to everyone in the room.
//     // io.sockets.in("room-" + roomno).emit('connectToRoom', "You are in room no. " + roomno);



//     // socket.on('addRoom', (room) => {
//     //     socket.join(room)
//     //     //(1)發送給在同一個 room 中除了自己外的 Client
//     //     socket.to(room).emit('addRoom', '已有新人加入聊天室！')
//     //     //(2)發送給在 room 中所有的 Client
//     //     io.sockets.in(room).emit('addRoom', '已加入聊天室！')
//     // })

//     var chatLists = {}

//     socket.on('addRoom', room => {
//         // check currently staying room
//         const nowRoom = Object.keys(socket.rooms).find(room => {
//             return room !== socket.id
//         })
//         // if yes, quite cirrent room
//         if (nowRoom) {
//             socket.leave(nowRoom)
//         }
//         // join new room
//         socket.join(room)
//         io.sockets.in(room).emit('addRoom', `有新人加入聊天室 ${room}！`)

//         if (chatLists[room]) {
//             console.log('have message records')
//             socket.emit('initialRoom', chatLists[room])
//         }


//         socket.on('chat message', (chat) => {
//             console.log('meaasge: ' + chat.content);

//             if (chatLists[room]) {
//                 chatLists[room].push(chat)
//             } else {
//                 chatLists[room] = [chat]
//             }

//             console.log('chatLists', chatLists)

//             // io.sockets.in(room).emit('chat message', `${chat.speaker}: ${chat.content}`);
//             io.sockets.in(room).emit('chat message', chat);
//         });
//     })




//     // 加入這一段
//     // 接收來自前端的 greet 事件
//     // 然後回送 greet 事件，並附帶內容
//     // socket.on("greet", () => {
//     //     socket.emit("greet", "Hi! Client.");
//     // });

//     //...
// });



// app.listen(port, () => { console.log(`Listening on port: ${port}`); });
server.listen(port, () => { console.log(`Listening on port: ${port}`); });

// app.io = io;

module.exports = { app };
// module.exports = { app, server, io };