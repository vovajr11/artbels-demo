const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const server = http.createServer(app);
const io = new Server(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const courseSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isVisible: { type: Boolean, default: false },
});

const Course = mongoose.model("course", courseSchema);

app.get("/", (req, res) => {
  console.log(req);
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("getData", async () => {
    const courses = await Course.find({});

    io.emit("data", courses);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
