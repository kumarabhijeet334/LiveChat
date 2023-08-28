const express = require('express');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const cors = require("cors")
const userRoute = require("./Routes/userRoute");
const chatRoutes = require("./Routes/chatRoutes");
const msgRoutes = require("./Routes/msgRoutes");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorHandle");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/msg", msgRoutes);

// ---------------------Deployment code---------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../client", "build", "index.html"))
  );
} else {
    app.get("/", (req, res) => {
        res.send("Welcome!");
    });
}
 
// ---------------------Deployment code---------------------

app.use(notFound);
app.use(errorHandler);



const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URL;

const server = app.listen(port, (req, res) => {
    console.log(`server is running on port...:${port}`)
});

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDb connection established"))
    .catch((error) => console.log("MongoDb connection failed", error.message));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "/",

    },
});

io.on("connection", (socket) => {
    console.log('connected to socket.io');

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED"); 
        socket.leave(userData._id);
    });
});