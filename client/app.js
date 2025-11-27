class ChatApp {
    constructor() {
        this.ws = null;
        this.username = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;

        this.initializeElements();
        this.attachEventListeners();
        this.loadUsername();
    }

    initializeElements() {
        this.usernameForm = document.getElementById('usernameForm');
        this.usernameFormElement = document.getElementById('usernameFormElement');
        this.usernameInput = document.getElementById('usernameInput');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
    }

    attachEventListeners() {
        this.usernameFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUsernameSubmit();
        });

        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    loadUsername() {
        const savedUsername = localStorage.getItem('chatUsername');
        if (savedUsername) {
            this.usernameInput.value = savedUsername;
        }
    }

    handleUsernameSubmit() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            alert('Please enter a username');
            return;
        }

        this.username = username;
        localStorage.setItem('chatUsername', username);
        this.connect();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.updateConnectionStatus(true);
                this.reconnectAttempts = 0;
                this.sendJoinMessage();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.showError('Connection error. Please try again.');
            };
        } catch (error) {
            console.error('Failed to connect:', error);
            this.showError('Failed to connect to server.');
        }
    }

    sendJoinMessage() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
                JSON.stringify({
                    type: 'join',
                    username: this.username,
                })
            );
        }
    }

    handleMessage(data) {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'joined':
                    this.onJoined();
                    break;
                case 'message':
                    this.displayMessage(message);
                    break;
                case 'system':
                    this.displaySystemMessage(message);
                    break;
                case 'error':
                    this.handleError(message.message);
                    break;
                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    onJoined() {
        this.usernameForm.style.display = 'none';
        this.chatContainer.style.display = 'flex';
        this.messageInput.focus();
    }

    sendMessage() {
        const text = this.messageInput.value.trim();

        if (!text) {
            return;
        }

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.showError('Not connected to server');
            return;
        }

        this.ws.send(
            JSON.stringify({
                type: 'message',
                text: text,
            })
        );

        this.messageInput.value = '';
    }

    displayMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        const isOwnMessage = message.username === this.username;
        messageDiv.classList.add(isOwnMessage ? 'user-message' : 'other-message');

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';

        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'message-username';
        usernameSpan.textContent = message.username;

        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'message-timestamp';
        timestampSpan.textContent = this.formatTimestamp(message.timestamp);

        headerDiv.appendChild(usernameSpan);
        headerDiv.appendChild(timestampSpan);

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = message.text;

        messageDiv.appendChild(headerDiv);
        messageDiv.appendChild(textDiv);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    displaySystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = message.text;

        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'message-timestamp';
        timestampSpan.textContent = this.formatTimestamp(message.timestamp);
        timestampSpan.style.display = 'block';
        timestampSpan.style.marginTop = '4px';
        timestampSpan.style.fontSize = '11px';

        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(timestampSpan);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) {
            return 'just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updateConnectionStatus(connected) {
        if (connected) {
            this.statusIndicator.classList.add('connected');
            this.statusText.textContent = 'Connected';
        } else {
            this.statusIndicator.classList.remove('connected');
            this.statusText.textContent = 'Disconnected';
        }
    }

    handleError(errorMessage) {
        this.showError(errorMessage);
        
        // If it's a username error, show the form again
        if (errorMessage.includes('username') || errorMessage.includes('Username')) {
            this.chatContainer.style.display = 'none';
            this.usernameForm.style.display = 'flex';
            this.usernameInput.focus();
        }
    }

    showError(message) {
        // Remove existing error messages
        const existingErrors = this.chatContainer.querySelectorAll('.error-message');
        existingErrors.forEach(err => err.remove());

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        this.chatContainer.insertBefore(errorDiv, this.chatContainer.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            
            setTimeout(() => {
                if (this.username) {
                    this.connect();
                }
            }, this.reconnectDelay);
        } else {
            this.showError('Failed to reconnect. Please refresh the page.');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

