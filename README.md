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
│   ├── app.js             # Frontend JavaScript
│   └── config.js          # Client configuration (WebSocket URL)
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

### Server Environment Variables

The server uses `.env` files for configuration (via `dotenv` package). A `.env.example` file is provided as a template.

**Available variables:**
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed CORS origins for separate client deployment (default: '*')
  - Use comma-separated list for multiple origins: `https://example.com,https://app.example.com`
  - Use '*' to allow all origins (not recommended for production)
- `SERVE_CLIENT` - Whether to serve static client files (default: 'true')
  - Set to 'false' when deploying client separately

**Setup:**
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit server/.env with your values
```

**Examples:**
```bash
# Using .env file (recommended)
# Edit server/.env, then:
cd server
npm run dev

# Or override via command line
PORT=8080 npm run dev

# Production with specific CORS origin
PORT=3000 CORS_ORIGIN=https://your-client-domain.com npm start

# API-only server (no static files)
SERVE_CLIENT=false PORT=3000 npm start
```

### Client Configuration

The client uses `client/config.js` to configure the WebSocket server URL.

> **Note:** A `config.example.js` file is provided. Copy it to `config.js` and update with your values.

**For local development** (server and client on same host):
```javascript
const CONFIG = {
  WS_SERVER_URL: '',  // Empty = auto-detect from current host
  AUTO_DETECT: true,
};
```

**For production** (separate server deployment):
```javascript
const CONFIG = {
  WS_SERVER_URL: 'wss://your-server.com',  // Your server URL
  AUTO_DETECT: false,
};
```

**Protocol notes:**
- Use `ws://` for HTTP connections
- Use `wss://` for HTTPS connections (required for secure sites)
- Include port if non-standard: `ws://your-server.com:3000`

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

## Deployment

### Separate Server and Client Deployment

This application supports deploying the server and client separately, which is useful for:
- Using a CDN for the client
- Deploying client to static hosting (Netlify, Vercel, GitHub Pages)
- Deploying server to cloud platforms (Heroku, Railway, Render, etc.)

#### Server Deployment

1. **Set environment variables:**
   
   Option A: Use `.env` file (recommended)
   ```bash
   # Copy example file
   cp server/.env.example server/.env
   
   # Edit server/.env with your values:
   PORT=3000
   CORS_ORIGIN=https://your-client-domain.com
   SERVE_CLIENT=false
   ```
   
   Option B: Set via hosting platform's environment variable settings
   ```bash
   PORT=3000
   CORS_ORIGIN=https://your-client-domain.com
   SERVE_CLIENT=false
   ```

2. **Deploy to your hosting platform:**
   - Ensure Node.js is installed
   - Run `npm install` in the `server` directory
   - Start with `npm start` or `node server.js`
   - The server will automatically load `.env` file if present

#### Client Deployment

1. **Create `client/config.js` from example:**
   ```bash
   cp client/config.example.js client/config.js
   ```

2. **Update `client/config.js` with your server URL:**
   ```javascript
   const CONFIG = {
     WS_SERVER_URL: 'wss://your-server-domain.com',
     AUTO_DETECT: false,
   };
   ```

3. **Deploy static files:**
   - Upload all files from the `client/` directory to your static host
   - Ensure `index.html`, `app.js`, `config.js`, and `styles.css` are accessible
   - The client will connect to the configured WebSocket server

#### Example Deployment Scenarios

**Scenario 1: Server on Heroku, Client on Netlify**
- Server: `https://chat-server.herokuapp.com`
- Client: `https://chat-app.netlify.app`
- Set `CORS_ORIGIN=https://chat-app.netlify.app` on server
- Set `WS_SERVER_URL: 'wss://chat-server.herokuapp.com'` in client config

**Scenario 2: Server on Railway, Client on Vercel**
- Server: `https://chat-api.railway.app`
- Client: `https://chat.vercel.app`
- Set `CORS_ORIGIN=https://chat.vercel.app` on server
- Set `WS_SERVER_URL: 'wss://chat-api.railway.app'` in client config

**Scenario 3: Both on same domain**
- Server: `https://api.example.com`
- Client: `https://example.com`
- Set `CORS_ORIGIN=https://example.com` on server
- Set `WS_SERVER_URL: 'wss://api.example.com'` in client config

## Development Notes

- The server uses in-memory storage (no database)
- Usernames are case-sensitive
- Maximum username length: 20 characters
- Maximum message length: 500 characters
- Messages are not persisted (lost on server restart)
- For production, configure CORS_ORIGIN to restrict access
- Use `wss://` (secure WebSocket) when deploying over HTTPS

## License

MIT

