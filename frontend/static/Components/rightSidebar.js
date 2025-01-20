import { createElementWithClass, cleanUp } from '/static/utils/utils.js';

// Declare socket variable in global scope but don't initialize it yet
let socket;
let attendeeslist;
const msg = {
    type: "message",
    receiverId: 0,
    Content: '',
};

// Move socket handlers into a separate function
function initializeWebSocket() {
    socket = new WebSocket('ws://localhost:3333/ws');

    socket.onopen = (event) => {
        console.log('Connected to the server');
        msg.type = 'status'
        socket.send(JSON.stringify(msg));
    }

    socket.onmessage = (event) => {
        let messagesArea = document.querySelector('.messages-area');
        const receivedData = JSON.parse(event.data);
        console.log(receivedData.type);
        if (receivedData.type == 'message') {
            const messageElement = createMessageElement(receivedData.content, 'message-container received');
            messagesArea.appendChild(messageElement);
        } else if (receivedData.type == 'status') {
            console.log('its heeeeeeeeeere');
            createUsers(receivedData.usersStatus)      
        }    
    };

    return socket;
}

export function closeSocket() {
    if (socket) {
        setTimeout(() => {
            msg.type = 'status'
            socket.send(JSON.stringify(msg));
            socket.close();
            console.log('WebSocket connection is closing...');
        },1000)
    }
}

export async function rightSidebar() {
    // Initialize WebSocket when rightSidebar is called
    socket = initializeWebSocket();

    const sidebarRight = createElementWithClass('div', 'sidebar-right');
    
    const topBar = createElementWithClass('div', 'top-bar');
    const searchBar = createElementWithClass('input', 'search-bar');
    searchBar.setAttribute('type', 'text');
    searchBar.setAttribute('placeholder', 'Type to search');
    topBar.appendChild(searchBar);
    
    const users = createElementWithClass('div', 'users');
    const usersHeader = createElementWithClass('div', 'users-header', 'Users');
    const attendeesList = createElementWithClass('div', 'attendees-list');
    attendeeslist = attendeesList;
    users.appendChild(usersHeader);
    users.appendChild(attendeesList);
    
    try {
        console.log('jjjjjjjjjjjjjjj>>');
        
        const response = await fetch('http://10.1.6.12:3333/api/users/status');

        console.log('vheeeeeeeeeeeeeeee.');
        const usersData = await response.json();
        
        usersData.forEach(user => {
            
            const userElement = createElementWithClass('div', 'user');
            userElement.setAttribute('senderId', user.id);
            
            const avatar = createElementWithClass('div', 'user-avatar');

            const userInfo = createElementWithClass('div', 'user-info');
            const userName = createElementWithClass('div', 'user-name');
            userName.textContent = `${user.firstName} ${user.lastName}`;
            
            const userEmail = createElementWithClass('div', 'user-email');
            userEmail.textContent = user.email;
            
            const userStatus = createElementWithClass('div', 'user-status');
            userStatus.classList.add(user.status === 'online' ? 'online' : 'offline');

            userInfo.appendChild(userName);
            userInfo.appendChild(userEmail);
            userElement.appendChild(avatar);
            userElement.appendChild(userStatus);
            userElement.appendChild(userInfo);
            
            addEventListenerToUser(userElement);
            attendeesList.appendChild(userElement);
        });

    } catch (error) {
        console.error('Error fetching users data:', error);
    }

    sidebarRight.appendChild(topBar);
    sidebarRight.appendChild(users);

    return sidebarRight;
}

function createUsers(usersData) {    
    attendeeslist.innerHTML = '';
    console.log('waaaaaaaaaak waaaaaaaaak');
    usersData.forEach(user => {
        console.log(user);
        
        const userElement = createElementWithClass('div', 'user');
        userElement.setAttribute('senderId', user.id);
        
        const avatar = createElementWithClass('div', 'user-avatar');

        const userInfo = createElementWithClass('div', 'user-info');
        const userName = createElementWithClass('div', 'user-name');
        userName.textContent = `${user.firstName} ${user.lastName}`;
        
        const userEmail = createElementWithClass('div', 'user-email');
        userEmail.textContent = user.email;
        
        const userStatus = createElementWithClass('div', 'user-status');
        userStatus.classList.add(user.status === 'online' ? 'online' : 'offline');

        userInfo.appendChild(userName);
        userInfo.appendChild(userEmail);
        userElement.appendChild(avatar);
        userElement.appendChild(userStatus);
        userElement.appendChild(userInfo);
        
        addEventListenerToUser(userElement);
        attendeeslist.appendChild(userElement);
    });
}

function addEventListenerToUser(userElement) {
    userElement.addEventListener('click', () => {
        const senderId = userElement.getAttribute('senderId');
        msg.receiverId = +senderId;
        createMessageInterface(userElement);
    });
}

async function createMessageInterface(userElement) {
    const mainContent = document.querySelector('.main-content');
    cleanUp(mainContent);

    const messagesContainer = createElementWithClass('div', 'messages-container');
    
    const chatHeader = createElementWithClass('div', 'chat-header');
    const recipientInfo = createElementWithClass('div', 'user');
    
    const originalUserName = userElement.querySelector('.user-name');
    const originalUserEmail = userElement.querySelector('.user-email');
    const originalStatus = userElement.querySelector('.user-status');
    
    const avatar = createElementWithClass('div', 'user-avatar');
    const userInfo = createElementWithClass('div', 'user-info');
    const userName = createElementWithClass('div', 'user-name');
    userName.textContent = originalUserName.textContent;
    
    const userEmail = createElementWithClass('div', 'user-email');
    userEmail.textContent = originalUserEmail.textContent;
    
    const userStatus = createElementWithClass('div', 'user-status');
    userStatus.classList.add(originalStatus.classList.contains('online') ? 'online' : 'offline');

    userInfo.appendChild(userName);
    userInfo.appendChild(userEmail);
    recipientInfo.appendChild(avatar);
    recipientInfo.appendChild(userStatus);
    recipientInfo.appendChild(userInfo);
    chatHeader.appendChild(recipientInfo);

    const messagesArea = createElementWithClass('div', 'messages-area');
    
    const inputArea = createElementWithClass('div', 'input-area');
    const messageInput = createElementWithClass('textarea', 'message-input');
    messageInput.setAttribute('placeholder', 'Type your message...');
    const sendButton = createElementWithClass('button', 'send-button', 'Send');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const messageElement = createMessageElement(message, 'message-container sent');
            messagesArea.appendChild(messageElement);
            msg.Content = messageInput.value;
            socket.send(JSON.stringify(msg));
            messageInput.value = '';
            msg.Content = '';
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    inputArea.appendChild(messageInput);
    inputArea.appendChild(sendButton);

    messagesContainer.appendChild(chatHeader);
    messagesContainer.appendChild(messagesArea);
    messagesContainer.appendChild(inputArea);

    mainContent.appendChild(messagesContainer);
}

function createMessageElement(content, msgClass) {
    const messageContainer = createElementWithClass('div', msgClass);
    
    const messageContent = createElementWithClass('div', 'message-content');
    messageContent.textContent = content;
    
    const messageTime = createElementWithClass('div', 'message-time');
    messageTime.textContent = new Date().toLocaleTimeString();
    
    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(messageTime);
    
    return messageContainer;
}