import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

function Chat({ socket }) {
  const [message, setMessage] = useState("");
  const [room, setroom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
    setroom("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("message-recieved", (data) => {
      console.log(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]); // Added socket to dependency array

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to the assignment section
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setroom(e.target.value)}
          id="outlined-basic"
          label="room"
          variant="outlined"
        />
        <Button type="submit" color="primary" variant="contained">
          Send Message
        </Button>
      </form>
    </Container>
  );
}

function App() {
  const [startChat, setStartChat] = useState(false);
  const socket = useMemo(() => io("http://localhost:3000"), []);

  return (
    <>
      {startChat ? (
        <Chat socket={socket} />
      ) : (
        <Container maxWidth="sm">
          <Typography variant="h3" component="div" gutterBottom>
            Welcome to the Our Chat Application
          </Typography>
          <Button onClick={() => setStartChat(true)}>Start Chat 🤼</Button>
        </Container>
      )}
    </>
  );
}

export default App;
