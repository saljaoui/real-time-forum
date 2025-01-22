import { createElementWithClass, cleanUp } from '/static/utils/utils.js';

let page = 0
let socket;
let attendeeslist;
const msg = {
    type: "message",
    receiverId: 0,
    Content: '',
    notif: '',
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
        } else if (receivedData.type == 'notif') {            
            createNotif(receivedData.userids)
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
        const userElemen = attendeeslist.querySelector(`div[senderId="${senderId}"]`);
        const statusElement = userElemen.querySelector('.user-notif');
        if (statusElement != null) {
            statusElement.remove()
        }
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
        if (messages == null) { return }
        
        const previousHeight = messagesArea.scrollHeight;
        
        messages.reverse().forEach((message) => {
            const messageElement = createMessageElement(
                message.content, 
                `message-container ${message.senderId != msg.receiverId ? 'sent' : 'received'}`
            );

            messagesArea.insertBefore(messageElement, messagesArea.firstChild);
        });

        messagesArea.scrollTop = messagesArea.scrollHeight - previousHeight;
        setupScrollListener();
    }
}
let loding = false
function setupScrollListener() {
    let messagesArea = document.querySelector('.messages-area');

    const throttledScroll = throttle(async () => {
        if (messagesArea.scrollTop <= 50 && !loding) {
            loding = true
            page++;
            await getMessagesHistory(page);
            messagesArea.scrollTop = messagesArea.scrollTop - 100
        }
        setTimeout(()=> {
            loding = false
        }, 200)
    }, 200);

    messagesArea.addEventListener('scroll', throttledScroll);
}

function throttle(func, limit) {
    let lastCall = 0;
    return function (arg) {
        const now = new Date().getTime();
        if (now - lastCall >= limit) {
            lastCall = now;
            func(arg);
        }
    };
}

async function getUserId() {
    const response = await fetch('/api/userId');
    const usersID = await response.json();
    return usersID    
}

function updateUserStatus(userId, status) {
    const userElement = attendeeslist.querySelector(`div[senderId="${userId}"]`);
    
    if (userElement) {
        const statusElement = userElement.querySelector('.user-status');
        
        if (statusElement) {
            statusElement.classList.remove('online', 'offline');
            statusElement.classList.add(status);
        }
        
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

function createNotif(userId) {
    const userElement = attendeeslist.querySelector(`div[senderId="${userId}"]`);
    const notifexit = userElement.querySelector('.user-notif')
    const chat = document.querySelector('.messages-container')
    
    if (notifexit == null && chat == null) {
    const notif = createElementWithClass('div', 'user-notif')
    userElement.appendChild(notif)
    }
}