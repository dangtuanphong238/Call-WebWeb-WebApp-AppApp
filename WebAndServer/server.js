// const express = require("express");

// var io = require("socket.io")({
//   path: "/webrtc",
// });

// const app = express();
// const port = 8080;

// // chạy front end
// app.use(express.static(__dirname + "/build"));
// app.get("/", (req, res, next) => {
//   res.sendFile(__dirname + "/build/index.html");
// });

// const server = app.listen(port, () => console.log("App listen", port));

// io.listen(server);

// const peers = io.of("/webrtcPeer");

// let connectedPeers = new Map();

// peers.on("connection", (socket) => {
//   console.log(socket.id);
//   socket.emit("connection-success", { success: socket.id });

//   connectedPeers.set(socket.id, socket);

//   socket.on("disconnect", () => {
//     console.log("disconnected");
//     connectedPeers.delete(socket.id);
//   });

//   socket.on("offerOrAnswer", (data) => {
//     // gửi 1 cái peer khác nếu có
//     for (const [socketID, socket] of connectedPeers.entries()) {
//       // không tự gửi cho mình
//       if (socketID !== data.socketID) {
//         console.log(socketID, data.payload.type);
//         socket.emit("offerOrAnswer", data.payload);
//       }
//     }
//   });

//   socket.on("candidate", (data) => {
//     // gửi candidate cho người khác nếu có
//     for (const [socketID, socket] of connectedPeers.entries()) {
//       // không tự gửi cho mình
//       if (socketID !== data.socketID) {
//         console.log(socketID, data.payload.type);
//         socket.emit("candidate", data.payload);
//       }
//     }
//   });
// });


const express = require("express");

var io = require("socket.io")({
  path: "/webrtc",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const app = express();
const port = 8080;

// chạy front end
app.use(express.static(__dirname + "/build"));
app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

const server = app.listen(port, () => console.log("App listen", port));

io.listen(server);

const peers = io.of("/webrtcPeer");

let connectedPeers = new Map();

peers.on("connection", (socket) => {
  console.log("SocketID", socket.id);
  socket.emit("connection-success", { success: socket.id });

  connectedPeers.set(socket.id, socket);
  socket.on("disconnect", () => {
    console.log("disconnected");
    connectedPeers.delete(socket.id);
  });

  socket.on("offerOrAnswer", (data) => {
    socket.to(data.idtocal).emit("offerOrAnswer", data.payload, data.yourid);
  });

  socket.on("candidate", (data) => {
    // gửi candidate cho người khác nếu có
    for (const [socketID, socket] of connectedPeers.entries()) {
      // không tự gửi cho mình
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload.type);
        socket.emit("candidate", data.payload);
      }
    }
  });
});
