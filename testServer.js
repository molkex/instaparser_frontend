import express from "express";
import io from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const socketServer = io(server, { origins: "*:*" });

import { errorTypes } from "./src/common/constants.js";

server.listen(3000, () => {
  console.log("listening on *:3000");
});

function withTimeout(fn, delay = 1000) {
  setTimeout(fn, delay);
}

socketServer.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("search", function([userName1, userName2]) {
    withTimeout(() =>
      socket.emit("check", [
        {
          username: 1,
          error: "",
          totalFollowers: 1000
        },
        {
          username: 2,
          error: "",
          totalFollowers: 5000
        }
      ])
    );

    withTimeout(
      () =>
        socket.emit("end", {
          count: 5,
          users: [
            { username: "qwrqwr" },
            { username: "wqrqwr" },
            { username: "123" },
            { username: "555" },
            { username: "111" }
          ]
        }),
      2000
    );
  });

  socket.on("command", function(command) {});
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/api/samefollowers/id1365136316", function(req, res) {
  res.json([{ name: "somename1" }, { name: "somename2" }]);
});
