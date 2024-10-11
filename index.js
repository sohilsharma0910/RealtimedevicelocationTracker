const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");

// Serve static files from the /public folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log("connected");
  socket.on("send-location", function (data) {
    io.emit("recive-location", {
      id: socket.id,
      ...data,
    });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

// Use dynamic port for deployment
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
