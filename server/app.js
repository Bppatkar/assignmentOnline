// Server side - index.js
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// IO means whole server and socket means particular
// and before that we use middleware cors
app.use(cors());

app.get("/", (req, res) => {
  res.end("hello world");
});

// creating circuit  where we get socket
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.emit("welcome", `Welcome to the server! ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} join the server`);

  socket.on("message", (message, room) => {
    console.log(message, room);
    // io.emit("message-recieved", data);
    // socket.broadcast.emit("message-recieved", message, room);
    io.to(room).emit("message-recieved", message, room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
