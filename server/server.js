const WebSocket = require('ws');

// Configuration
const PORT = 8080;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// Initialize server
const wss = new WebSocket.Server({ port: PORT });
let espSocket = null;
let clients = [];

console.log(`📡 WebSocket Server running on ws://localhost:${PORT}`);

// Helper Functions
const isEspMessage = (data) => data.uid && typeof data.uid === 'string';

const isClientMessage = (data) =>
  data.action && typeof data.action === 'string' &&
  data.uid && typeof data.uid === 'string';

  const isClientCommand = (data) => 
    data.type === 'beep' && 
    (!data.duration || typeof data.duration === 'number');

// Heartbeat for ESP32 connection
setInterval(() => {
  if (espSocket?.readyState === WebSocket.OPEN) {
    espSocket.ping();
  }
}, HEARTBEAT_INTERVAL);

// Broadcast to all React clients
function broadcastToClients(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// WebSocket connection handler
wss.on('connection', (socket) => {
  // Message Handler
  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (!data) throw new Error("Empty message");

      // Validate and route messages
      if (isEspMessage(data)) {
        //console.log(`📡 UID from ESP32: ${data.uid}`);
        broadcastToClients({ uid: data.uid });
      } 
      else if (isClientCommand(data)) {
        // Handle React client commands
        if (data.type === 'beep') {
          console.log(`🔔 Beep command received`, {
            duration: data.duration || 1500,
            targetStatus: espSocket?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
          });

          if (espSocket?.readyState === WebSocket.OPEN) {
            espSocket.send(JSON.stringify({
              type: 'beep',
              duration: data.duration || 1500
            }));
          }
        }
      } 
      else {
        throw new Error("Invalid message format");
      }

    } catch (err) {
      socket.send(JSON.stringify({ 
        error: true,
        message: err.message 
      }));
    }
  });

  // Connection Cleanup
  socket.on('close', () => {
    if (socket === espSocket) {
      //console.log('⚡ ESP32 disconnected');
      espSocket = null;
    } else {
      clients = clients.filter(client => client !== socket);
      //console.log('🖥️ Web client disconnected');
    }
  });

  // Initial Handshake
  socket.once('message', (message) => {
    try {
      const init = JSON.parse(message.toString());
      if (init.type === 'esp') {
        espSocket = socket;
        //console.log("🧠 ESP32 registered");
      } else {
        clients.push(socket);
       // console.log("🖥️ New web client registered");
      }
    } catch (err) {
      console.error("❌ Handshake failed:", err);
      socket.close(1003, "Invalid handshake");
    }
  });
});

// Cleanup on server shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  wss.clients.forEach(client => client.close());
  wss.close();
  process.exit();
});
