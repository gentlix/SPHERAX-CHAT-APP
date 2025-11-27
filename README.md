# WebSocket Chat Application

A simple real-time chat web application built with Node.js and WebSockets. Users can join a global chat room, send messages, and see system notifications when users join or leave.

## Tech Stack

### Backend
- **Node.js** (LTS 24.x compatible)
- **Express** - HTTP server framework
- **ws** - Native WebSocket library

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations

### Package Manager
- **npm** - Node package manager

## Features

- ✅ Username input and validation
- ✅ Global chat room
- ✅ Real-time message broadcasting via WebSockets
- ✅ System notifications for user join/leave events
- ✅ Connection status indicator
- ✅ Message timestamps
- ✅ Responsive design
- ✅ Auto-reconnect on disconnect
- ✅ Error handling and validation

## Project Structure

```
websocket-chatapp/
├── server/
│   ├── server.js          # Backend server with WebSocket handling
│   └── package.json       # Server dependencies
├── client/
│   ├── index.html         # Frontend HTML
│   ├── styles.css         # Frontend styles
│   └── app.js             # Frontend JavaScript
├── package.json           # Root package.json
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## Local Setup & Run

### Prerequisites

- Node.js (LTS version, e.g., 20.x or 24.x)
- npm (comes with Node.js)

### Step-by-Step Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd websocket-chatapp
   ```

2. **Install dependencies**
   
   Option A: Install all at once (recommended)
   ```bash
   npm run install-all
   ```
   
   Option B: Install separately
   ```bash
   # Install root dependencies (if any)
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies (none required for vanilla JS)
   cd ../client
   # No npm install needed for vanilla JS frontend
   ```

3. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   
   The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

4. **Open the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. **Test the application**
   - Enter a username and click "Join Chat"
   - Open multiple browser tabs/windows to simulate multiple users
   - Send messages and see them appear in real-time across all tabs
   - Close a tab to see the "left the chat" system message

## WebSocket Protocol

### Client → Server Messages

#### Join Chat
```json
{
  "type": "join",
  "username": "Alice"
}
```

#### Send Message
```json
{
  "type": "message",
  "text": "Hello everyone!"
}
```

### Server → Client Messages

#### Join Confirmation
```json
{
  "type": "joined",
  "username": "Alice",
  "timestamp": "2025-01-20T09:30:00.000Z"
}
```

#### Chat Message
```json
{
  "type": "message",
  "username": "Alice",
  "text": "Hello everyone!",
  "timestamp": "2025-01-20T09:31:00.000Z"
}
```

#### System Notification
```json
{
  "type": "system",
  "text": "Alice joined the chat",
  "timestamp": "2025-01-20T09:31:05.000Z"
}
```

#### Error Message
```json
{
  "type": "error",
  "message": "Username is required",
  "timestamp": "2025-01-20T09:31:10.000Z"
}
```

## API Endpoints

### GET /health
Health check endpoint to verify server is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)

Example:
```bash
PORT=8080 npm run dev
```

## Code Structure

### Backend (`server/server.js`)

- **Express server** - Serves static files and provides health check endpoint
- **WebSocket server** - Handles real-time connections
- **Client management** - Tracks connected clients with their usernames
- **Message handling** - Processes join and message events
- **Broadcasting** - Sends messages to all connected clients
- **Error handling** - Validates messages and sends error responses
- **Graceful shutdown** - Handles SIGTERM and SIGINT signals

### Frontend (`client/app.js`)

- **ChatApp class** - Main application controller
- **WebSocket client** - Manages connection to server
- **Message handling** - Processes incoming messages and updates UI
- **UI management** - Shows/hides forms, displays messages
- **Auto-reconnect** - Attempts to reconnect on disconnect
- **Local storage** - Saves username for convenience

## Error Handling

The application handles:
- Invalid WebSocket messages
- Missing required fields (username, message text)
- Duplicate usernames
- Client disconnections
- Connection errors
- Network failures with auto-reconnect

## Browser Compatibility

Works in all modern browsers that support:
- WebSocket API
- ES6+ JavaScript features
- CSS3 features

Tested in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Notes

- The server uses in-memory storage (no database)
- Usernames are case-sensitive
- Maximum username length: 20 characters
- Maximum message length: 500 characters
- Messages are not persisted (lost on server restart)

## License

MIT

