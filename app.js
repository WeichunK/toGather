const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { PORT, API_VERSION } = process.env;
const port = PORT
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { chat } = require('./server/controllers/socket_io')
const { pool } = require('./server/models/mysqlcon');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// const { checkGatheringStatus } = require('./server/models/gathering_model')


app.use('/api/' + API_VERSION,
    // rateLimiterRoute,
    [
        require('./server/routes/gathering_route'),
        require('./server/routes/user_route'),
        require('./server/routes/tracking_route'),
        require('./server/routes/chat_route'),
    ]
);

app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

chat(io);

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);

});

module.exports = { app };
