import { createElementWithClass, cleanUp } from '/static/utils/utils.js';

let page = 0
let socket;
let attendeeslist;
const msg = {
    type: "message",
    receiverId: 0,
    Content: '',
};

function initializeWebSocket() {
    socket = new WebSocket('ws://localhost:3333/ws');
    
    socket.onmessage = (event) => {        
        const receivedData = JSON.parse(event.data);
        if (receivedData.type == 'message') {
            if (msg.receiverId == receivedData.senderId) {
            let messagesArea = document.querySelector('.messages-area');
            const messageElement = createMessageElement(receivedData.content, 'message-container received');
            messagesArea.appendChild(messageElement);
            messagesArea.scrollTop = messagesArea.scrollHeight;
            }
        
        } else if (receivedData.type == 'status') { 
            //{type: 'status', userid: 1, status: 'online'}
            updateUserStatus(receivedData.userid, receivedData.status)    
        } 
    };

    return socket;
}




export async function rightSidebar() {

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
        const response = await fetch('/api/users/status');
        const usersData = await response.json();
        let user_id = await getUserId()        
        usersData.forEach(user => {
            if (user_id != user.id) {
                console.log(user_id, " >>>> ", user.id);
                
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
            }
        });

    } catch (error) {
        console.error('Error fetching users data:', error);
    }

    sidebarRight.appendChild(topBar);
    sidebarRight.appendChild(users);

    return sidebarRight;
}
function addEventListenerToUser(userElement) {
    userElement.addEventListener('click', () => {
        const senderId = userElement.getAttribute('senderId');
        msg.receiverId = +senderId
        page = 0
        createMessageInterface(userElement);
        getMessagesHistory(page)
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
            msg.Content = messageInput.value
            msg.type = 'message'
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
    
    messageContainer.appendChild(messageTime);
    messageContainer.appendChild(messageContent);
    
    return messageContainer;
}

async function getMessagesHistory(page) {
    const response = await fetch(`/api/messages/history?receiverId=${msg.receiverId}&page=${page}`, {
        method: 'GET',
    });

    if (response.ok) {
        const messages = await response.json();
        let messagesArea = document.querySelector('.messages-area');
        
        const previousHeight = messagesArea.scrollHeight;
        
        messages.reverse().forEach((message) => {
            const messageElement = createMessageElement(
                message.content, 
                `message-container ${message.senderId != msg.receiverId ? 'sent' : 'received'}`
            );

            messagesArea.insertBefore(messageElement, messagesArea.firstChild);
        });

        messagesArea.scrollTop = messagesArea.scrollHeight - previousHeight;
        setupScrollListener()
    }
}

function setupScrollListener() {
    let messagesArea = document.querySelector('.messages-area');
    let isLoading = false;

    messagesArea.addEventListener('scroll', async () => {
        if (messagesArea.scrollTop === 0 && !isLoading) {
            isLoading = true;
            page++;
            await getMessagesHistory(page);
            isLoading = false;
        }
    });
}

async function getUserId() {
    const response = await fetch('/api/userId');
    const usersID = await response.json();
    return usersID    
}

function updateUserStatus(userId, status) {
    // Find the user element with the matching senderId
    const userElement = attendeeslist.querySelector(`div[senderId="${userId}"]`);
    
    if (userElement) {
        // Find the status element within the user element
        const statusElement = userElement.querySelector('.user-status');
        
        if (statusElement) {
            // Remove existing status classes
            statusElement.classList.remove('online', 'offline');
            // Add new status class
            statusElement.classList.add(status);
        }
        
        // If there's an open chat with this user, update the chat header status too
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader && msg.receiverId === userId) {
            const headerStatus = chatHeader.querySelector('.user-status');
            if (headerStatus) {
                headerStatus.classList.remove('online', 'offline');
                headerStatus.classList.add(status);
            }
        }
    }
}

export function closeSocket() {
    socket.close()
}