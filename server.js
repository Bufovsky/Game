const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const mysql = require("mysql2/promise");
const cors = require('cors');
var players_online = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    origin: "http://localhost:8080",
    origin: "http://localhost",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


/**
 * MYSQL PART
 */


db = mysql.createPool({
  host: "#",
  user: "#",
  password: "#",
  database: "#",
});

app.get('/query/:sql', async (req, res) => {
  try {
    const sql = req.params.sql;
    let query = await db.query(sql);
    let result = query.length > 0 ? query[0] : query;

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error executing.' });
  }
});


/**
 * SOCKET.IO PART
 */


io.on('connection', (socket) => {
  console.log('a user connected');
  io.to(socket.id).emit('socketId', {"socket_id": socket.id, "online": players_online});

  socket.on('disconnect', () => {
      console.log('user disconnected');
      console.log(socket.id);
      delete players_online[socket.id];
      io.emit('playerLogout', {"socket_id": socket.id});
  });

  socket.on("login", (value) => {
    console.log('LOGIN');
    players_online[socket.id.toString()] = {"id": value.id, "socket_id": socket.id};
    io.emit('playerLogin', {"id": value.id, "online": players_online, "socket_id": socket.id});
  });

  socket.on("playerLogin", (value) => {
    console.log('PLAYER LOGIN');
    players_online[socket.id.toString()] = {"id": value.id, "socket_id": socket.id};
    console.log(players_online);
    io.emit('playerLogin', {"id": value.id, "online": players_online, "socket_id": socket.id});
  });

  socket.on("playerLogout", (value) => {
    console.log('PLAYER LOGOUT');
    io.emit('playerLogout', {"id": value.id, "socket_id": socket.id});
  });

  socket.on("updatePlayerPos", (value) => {
    console.log('PLAYER MOVE');
    console.log(value);
    io.emit('updatePlayerPos', value);
  });
});