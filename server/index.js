// This is where we set up our Express server. Node and Express is used to create our backend

// This is the creation of the express server
const express = require("express");

// Our app variable, just an instance of the express library. Used for creation of our backend server
const app = express();

// An instance of the http library to help create our http server
const http = require("http");

// We grab the "Server" class from the socket.io library
const { Server } = require("socket.io");

// Import of the cors library
const cors = require("cors");

// We set the project to accept cors
app.use(cors());

// The actual creation of the http server. It's how an http server is created with Express
const server = http.createServer(app);

// The variable we'll use to do anything related to socket.io in the backend. We pass in our
// http server then put cors related info in the curly braces
const io = new Server(server, {
  // This is a way on how we specify all the functions and properties we could want with cors in the project
  cors: {
    // This is the URL for our frontend
    origin: "http://localhost:3000",
    // We can also specify what kind of methos are accepted on the server
    methods: ["GET", "POST"],
  },
});

// With the use of the socket variable we can listen to custom made events
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Function to be called when a user joins a room. It has them join whatever
  // room number they sent to the backend here
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    // This is to send the data to everyone else in the same room/that's connected to the server/site
    socket.to(data.room).emit("receive_message", data);
  });
});

// We set the server to listen to port 3001 cause the regular React app is running on port 3000
// The second parameter is a server that console.logs a message
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
