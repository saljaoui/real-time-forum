const socket = new WebSocket('ws://localhost:3333/ws');
console.log("webSocket");

const msg = {
    type: "message",
    senderId: 1,
    receiverId: 2,
    Content:'soufian is OK',
    Timestamp: Date.now(),
};

socket.send(JSON.stringify(msg));
socket.onmessage = (event) => {
    console.log(event.data);
  };

// this for closing the connection
// socket.close();