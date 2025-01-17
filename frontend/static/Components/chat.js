export function chat() {
    // Select the .main-content div
    const middleDiv = document.querySelector('.main-content');

    if (!middleDiv) return; // Exit if .main-content does not exist

    // Clear only the contents inside .main-content
    middleDiv.innerHTML = '';

    // Inject the chat app structure with new class names
    middleDiv.innerHTML = `
        <aside class="chat-sidebar">
            <h2>Chat with</h2>
            <ul id="chat-users"></ul>
        </aside>
        <main class="chat-main">
            <div id="chat-conversation"></div>
            <form id="chat-form">
                <input type="text" id="chat-input" placeholder="Send message" autocomplete="off" />
                <button type="submit" id="chat-send">Send ᯓ✉︎</button>
            </form>
        </main>
        <template id="chat-user-template">
            <li></li>
        </template>
        <template id="chat-message-template">
            <div class="chat-message">
                <span class="chat-sender"></span>
                <p class="chat-text"></p>
                <span class="chat-time"></span>
            </div>
        </template>
    `;

    // Initialize WebSocket connection with new endpoint
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/api/ws/chat`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('Connected to chat server');
        document.getElementById('chat-send').disabled = false;
    };

    ws.onclose = () => {
        console.log('Disconnected from chat server');
        document.getElementById('chat-send').disabled = true;
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        document.getElementById('chat-send').disabled = true;
    };

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            displayMessage(message);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    // Attach event listener for sending messages
    document.getElementById('chat-form').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage(ws);
    });
}

function displayMessage(message) {
    const messageContainer = document.getElementById('chat-conversation');
    const template = document.getElementById('chat-message-template').content.cloneNode(true);
    
    // Set sender name based on message type
    const senderName = message.type === 'sender' ? 'You' : `User ${message.sender_id}`;
    template.querySelector('.chat-sender').textContent = senderName;
    template.querySelector('.chat-text').textContent = message.message;
    template.querySelector('.chat-time').textContent = new Date().toLocaleTimeString();

    // Add message to conversation
    messageContainer.prepend(template);
}

function sendMessage(ws) {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message !== '' && ws.readyState === WebSocket.OPEN) {
        const messageData = {
            message: message,
            reciever_id: 1, // Replace with actual recipient ID
            timestamp: new Date().toISOString()
        };

        try {
            ws.send(JSON.stringify(messageData));
            input.value = ''; // Clear input
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}