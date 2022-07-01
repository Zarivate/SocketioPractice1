import "./App.css";
import io from "socket.io-client";

// This use effect hook is used to listen to the event being sent back after we send out message
import { useEffect, useState } from "react";

// We pass in the url for our backend server
const socket = io.connect("http://localhost:3001");

function App() {
  // State for the room numbers that users might type in
  const [room, setRoom] = useState("");

  // A state that we'll use just to get whatever it is the user typed into the message box
  const [message, setMessage] = useState("");

  // This is so we can display the message in the UI
  const [messageReceived, setMessageReceived] = useState("");

  // Function to be called whenever a user types in a room to join, assuming that what they
  // typed in isn't blank
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  // Function that gets called everytime the button is pressed
  const sendMessage = () => {
    // We emit a message to our backend (in our index.js server file), that when the backend receives it
    // another event can then be emitted that's received on the frontend

    // The second variable is an object that will hold data to be sent
    socket.emit("send_message", { message, room });
  };

  // This hook is called whenever we receive a message, in other words whenever an event is
  // thrown to us in the socket.io server. That's why we have the socket variable in the dependencies,
  // that way whenever an event is emitted then useEffect will run again
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // This is how the correct message is stored to be displayed
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App;
