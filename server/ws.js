const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8008 });

const clients = new Set();

server.on('connection', socket => {
  console.log('Client connected');
  clients.add(socket);

  socket.on('message', message => {
    for (let client of clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    clients.delete(socket);
  });
});
