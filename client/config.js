// Configuration for WebSocket Chat Application
// Update these values when deploying to production

const CONFIG = {
  // WebSocket server URL
  // For local development: leave empty to use current host
  // For production: set to your server URL (e.g., 'wss://your-server.com' or 'ws://your-server.com:3000')
  WS_SERVER_URL: 'https://spherax-chat-app.onrender.com',

  // Auto-detect protocol and host if WS_SERVER_URL is empty
  // Set to false if you want to explicitly set the URL
  AUTO_DETECT: true,
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.CHAT_CONFIG = CONFIG;
}

