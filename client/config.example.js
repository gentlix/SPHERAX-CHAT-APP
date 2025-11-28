// Configuration for WebSocket Chat Application
// Copy this file to config.js and update with your server URL

const CONFIG = {
  // WebSocket server URL
  // For local development: leave empty to use current host
  // For production: set to your server URL
  // Examples:
  //   'wss://your-server.com'           (HTTPS)
  //   'ws://your-server.com:3000'        (HTTP with port)
  //   'wss://api.example.com'            (Subdomain)
  WS_SERVER_URL: '',

  // Auto-detect protocol and host if WS_SERVER_URL is empty
  // Set to false if you want to explicitly set the URL
  AUTO_DETECT: true,
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.CHAT_CONFIG = CONFIG;
}

