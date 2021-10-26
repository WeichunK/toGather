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

// app.listen(port, () => { console.log(`Listening on port: ${port}`); });
server.listen(port, () => { console.log(`Listening on port: ${port}`); });

app.io = io;

module.exports = { app, server, io };