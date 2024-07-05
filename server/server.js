const WebSocket = require('websocket').server;
const http = require('http');

const server = http.createServer((request, response) => {
  // Handle HTTP requests here
});

const webSocketServer = new WebSocket({
  httpServer: server,
});

// Store all active connections
let connections = [];

webSocketServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  // Add new connection to the list of connections
  connections.push(connection);

  connection.on('message', (message) => {
    // Send the received message to everyone
    connections.forEach((con) => {
      // Check if the connection is still open
      if (con.connected) {
        con.sendUTF(message.utf8Data);
      }
    });
  });

  connection.on('close', (reasonCode, description) => {
    // Remove connection from the list of connections
    connections = connections.filter((con) => con !== connection);
  });
});

server.listen(3001, () => {
  console.log('WebSocket server is listening on port 3001');
});