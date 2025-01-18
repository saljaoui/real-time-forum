import { createElementWithClass, cleanUp } from '/static/utils/utils.js';

export async function rightSidebar() {
    const sidebarRight = createElementWithClass('div', 'sidebar-right');
    const topBar = createElementWithClass('div', 'top-bar');
    const searchBar = createElementWithClass('input', 'search-bar');
    searchBar.setAttribute('type', 'text');
    searchBar.setAttribute('placeholder', 'Type to search');
    topBar.appendChild(searchBar);

    const users = createElementWithClass('div', 'users');
    const attendeesList = createElementWithClass('div', 'attendees-list');
    users.appendChild(createElementWithClass('div', 'users-header', 'Users'));
    users.appendChild(attendeesList);

    try {
        const response = await fetch('http://localhost:3333/api/users/status');
        const usersData = await response.json();

        usersData.forEach(user => {
            const userElement = createElementWithClass('div', 'user');
            userElement.setAttribute('senderId', user.id);
            const avatar = createElementWithClass('div', 'user-avatar');
            const userInfo = createUserInfo(user);
            const userStatus = createElementWithClass('div', 'user-status');
            userStatus.classList.add(user.status === 'online' ? 'online' : 'offline');

            userElement.appendChild(avatar);
            userElement.appendChild(userStatus);
            userElement.appendChild(userInfo);
            userElement.addEventListener('click', () => createMessageInterface(user.id, userElement));
            attendeesList.appendChild(userElement);
        });
    } catch (error) {
        console.error('Error fetching users data:', error);
    }

    sidebarRight.appendChild(topBar);
    sidebarRight.appendChild(users);
    return sidebarRight;
}

function createUserInfo(user) {
    const userInfo = createElementWithClass('div', 'user-info');
    userInfo.appendChild(createElementWithClass('div', 'user-name', `${user.firstName} ${user.lastName}`));
    userInfo.appendChild(createElementWithClass('div', 'user-email', user.email));
    return userInfo;
}

async function createMessageInterface(senderId, userElement) {
    const mainContent = document.querySelector('.main-content');
    cleanUp(mainContent);

    const messagesContainer = createElementWithClass('div', 'messages-container');
    const chatHeader = createElementWithClass('div', 'chat-header');
    const recipientInfo = createUserInfoForChatHeader(userElement);

    chatHeader.appendChild(recipientInfo);
    const messagesArea = createElementWithClass('div', 'messages-area');
    const inputArea = createInputArea(messagesArea);

    messagesContainer.appendChild(chatHeader);
    messagesContainer.appendChild(messagesArea);
    messagesContainer.appendChild(inputArea);
    mainContent.appendChild(messagesContainer);
}

function createUserInfoForChatHeader(userElement) {
    const recipientInfo = createElementWithClass('div', 'user');
    const avatar = createElementWithClass('div', 'user-avatar');
    const userInfo = createElementWithClass('div', 'user-info');
    userInfo.appendChild(userElement.querySelector('.user-name').cloneNode(true));
    userInfo.appendChild(userElement.querySelector('.user-email').cloneNode(true));
    const userStatus = createElementWithClass('div', 'user-status');
    userStatus.classList.add(userElement.querySelector('.user-status').classList.contains('online') ? 'online' : 'offline');
    recipientInfo.appendChild(avatar);
    recipientInfo.appendChild(userStatus);
    recipientInfo.appendChild(userInfo);
    return recipientInfo;
}

function createInputArea(messagesArea) {
    const inputArea = createElementWithClass('div', 'input-area');
    const messageInput = createElementWithClass('textarea', 'message-input');
    messageInput.setAttribute('placeholder', 'Type your message...');
    const sendButton = createElementWithClass('button', 'send-button', 'Send');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            messagesArea.appendChild(createMessageElement(message));
            messageInput.value = '';
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
    return inputArea;
}

function createMessageElement(content) {
    const messageContainer = createElementWithClass('div', 'message-container', 'sent');
    const messageContent = createElementWithClass('div', 'message-content', content);
    const messageTime = createElementWithClass('div', 'message-time', new Date().toLocaleTimeString());
    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(messageTime);
    return messageContainer;
}
