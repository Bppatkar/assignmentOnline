import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [startChat, setStartChat] = useState(false);

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
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
  }, []);

  return (
    <Container maxWidth="sm">
      {startChat ? (
        <>
          <Typography variant="h3" component="div" gutterBottom>
            Welcome to the assignment section
          </Typography>
          <Typography variant="h6" component="div">
            {socketID}
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
              onChange={(e) => setRoom(e.target.value)}
              id="outlined-basic"
              label="Room"
              variant="outlined"
            />
            <Button type="submit" color="primary" variant="contained">
              Send Message
            </Button>
          </form>
        </>
      ) : (
        <>
          <Typography variant="h3" component="div" gutterBottom>
            Welcome to the home screen
          </Typography>
          <Button onClick={() => setStartChat(true)}>Start Chat ✏</Button>
        </>
      )}
    </Container>
  );
}

export default App;
