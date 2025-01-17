import { createElementWithClass } from '/static/utils/utils.js';
import { chat } from '/static/Components/chat.js';


const socket = new WebSocket('ws://localhost:3333/api/users');

socket.onopen = function(event) {
    console.log('WebSocket connection established');
    // Send initial message to get users list
    socket.send('');
    socket.send('');
};

socket.onclose = function(event) {
    console.log('Connection closed');
};

// Keep connection alive
setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send('');
    }
}, 5000);

function handleUserClick(userId) {
    console.log(`User ${userId} clicked`);
    chat()
}

export function rightSidebar() {
    const sidebarRight = createElementWithClass('div', 'sidebar-right');
    
    const topBar = createElementWithClass('div', 'top-bar');
    const searchBar = createElementWithClass('input', 'search-bar');
    searchBar.setAttribute('type', 'text');
    searchBar.setAttribute('placeholder', 'Type to search');
    topBar.appendChild(searchBar);
    
    const users = createElementWithClass('div', 'users');
    const usersHeader = createElementWithClass('div', '', 'Users');
    const attendeesList = createElementWithClass('div', 'attendees-list');
    
    // Add search functionality
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const userDivs = attendeesList.getElementsByClassName('attendee');
        
        Array.from(userDivs).forEach(div => {
            const nameSpan = div.querySelector('span:last-child');
            const name = nameSpan.textContent.toLowerCase();
            div.style.display = name.includes(searchTerm) ? '' : 'none';
        });
    });
    
    socket.onmessage = (event) => {
        console.log('Raw WebSocket message:', event.data);
        
        try {
            if (!event.data || event.data === "null") {
                console.log('No data received, sending request...');
                socket.send('');
                return;
            }

            const users = JSON.parse(event.data);
            console.log('Parsed users:', users);
            
            if (Array.isArray(users)) {
                updateAttendeesList(users, attendeesList);
            } else {
                console.warn('Received data is not an array:', users);
                updateAttendeesList([], attendeesList);
            }
        } catch (e) {
            console.error('Error processing message:', e);
            updateAttendeesList([], attendeesList);
        }
    };
    
    users.appendChild(usersHeader);
    users.appendChild(attendeesList);
    
    sidebarRight.appendChild(topBar);
    sidebarRight.appendChild(users);

    return sidebarRight;
}

function updateAttendeesList(users, attendeesList) {
    attendeesList.innerHTML = '';
    
    users.forEach(user => {
        if (!user || !user.firstname) return;
        
        const attendeeDiv = createElementWithClass('div', 'attendee');
        const attendeeAvatar = createElementWithClass('img', 'attendee-avatar');
        
        // Add click event listener properly
        attendeeDiv.addEventListener('click', () => handleUserClick(user.id));
        
        // Make it look clickable
        attendeeDiv.style.cursor = 'pointer';
        
        attendeeAvatar.src = "/static/imgs/guest.png";
        
        const status = createElementWithClass(
            'span', 
            user.status === 'online' ? 'logged-in' : 'logged-out',
            '●'
        );
        
        const attendeeName = createElementWithClass(
            'span', 
            'attendee-name', 
            `${user.firstname} ${user.lastname || ''}`
        );
        
        attendeeDiv.appendChild(status);
        attendeeDiv.appendChild(attendeeAvatar);
        attendeeDiv.appendChild(attendeeName);
        attendeesList.appendChild(attendeeDiv);
    });
}