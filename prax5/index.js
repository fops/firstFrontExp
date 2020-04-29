const express = require("express");
const path = require("path");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
let rooms = 0;

app.use(express.static("."));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ttt.html"));
});

io.on("connection", socket => {
  // создание игры и главы игры
  socket.on("createGame", data => {
    socket.join(`${++rooms}`);
    socket.emit("newGame", { name: data.name, room: `${rooms}` });
  });

  // подкл другого перса
  socket.on("joinGame", function(data) {
    var room = io.nsps["/"].adapter.rooms[data.room];
    if (room && room.length === 1) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit("user1", {});
      socket.emit("user2", { name: data.name, room: data.room });
    } else {
      socket.emit("err", { message: "Mangijad on juba olemas!" });
    }
  });

  /**
   * проверка хода
   */
  socket.on("playTurn", data => {
    socket.broadcast.to(data.room).emit("turnPlayed", {
      tile: data.tile,
      room: data.room
    });
  });

  /**
   *конец игры
   */
  socket.on("gameEnded", data => {
    socket.broadcast.to(data.room).emit("gameEnd", data);
  });
});
server.listen(process.env.PORT || 7500);
