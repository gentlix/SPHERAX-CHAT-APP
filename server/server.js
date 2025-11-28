// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const SERVE_CLIENT = process.env.SERVE_CLIENT !== 'false';

// Store connected clients with their usernames
const clients = new Map();

// CORS middleware for separate client deployment
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (CORS_ORIGIN === '*') {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin) {
    const allowedOrigins = CORS_ORIGIN.split(',').map(o => o.trim());
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from client directory (only if serving from same origin)
if (process.env.SERVE_CLIENT !== 'false') {
  app.use(express.static(path.join(__dirname, '../client')));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'join':
          handleJoin(ws, message);
          break;
        case 'message':
          handleMessage(ws, message);
          break;
        default:
          sendError(ws, 'Unknown message type');
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      sendError(ws, 'Invalid message format');
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleJoin(ws, message) {
  const username = message.username?.trim();

  if (!username) {
    sendError(ws, 'Username is required');
    return;
  }

  // Check if username is already taken
  const usernameTaken = Array.from(clients.values()).some(
    (client) => client.username === username
  );

  if (usernameTaken) {
    sendError(ws, 'Username is already taken');
    return;
  }

  // Store client with username
  clients.set(ws, { username, joinedAt: new Date() });

  // Send join confirmation
  ws.send(
    JSON.stringify({
      type: 'joined',
      username: username,
      timestamp: new Date().toISOString(),
    })
  );

  // Broadcast system message to all other clients
  broadcastSystemMessage(`${username} joined the chat`);

  console.log(`${username} joined the chat`);
}

function handleMessage(ws, message) {
  const client = clients.get(ws);

  if (!client) {
    sendError(ws, 'You must join the chat first');
    return;
  }

  const text = message.text?.trim();

  if (!text) {
    sendError(ws, 'Message text is required');
    return;
  }

  // Broadcast message to all clients
  const chatMessage = {
    type: 'message',
    username: client.username,
    text: text,
    timestamp: new Date().toISOString(),
  };

  broadcastMessage(chatMessage);
  console.log(`${client.username}: ${text}`);
}

function handleDisconnect(ws) {
  const client = clients.get(ws);

  if (client) {
    const username = client.username;
    clients.delete(ws);
    broadcastSystemMessage(`${username} left the chat`);
    console.log(`${username} disconnected`);
  }
}

function broadcastMessage(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

function broadcastSystemMessage(text) {
  const systemMessage = {
    type: 'system',
    text: text,
    timestamp: new Date().toISOString(),
  };
  broadcastMessage(systemMessage);
}

function sendError(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: 'error',
        message: message,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

