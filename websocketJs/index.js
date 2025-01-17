const userStatusDiv = document.querySelector('.user_status');

const socket = new WebSocket('ws://localhost:3333/api/users');
let intervalId;

socket.onopen = function(event) {

  if (!intervalId) {
    intervalId = setInterval(sendMessage, 1000);
  }
};

socket.onmessage = function(event) {
    
    const users = JSON.parse(event.data);
    
    userStatusDiv.innerHTML = '';
    
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-container';
        
        const h1 = document.createElement('h1');
        h1.textContent = user.firstname;
        
        const h2 = document.createElement('h2');
        h2.textContent = user.lastname;
        
        const statusSpan = document.createElement('span');
        statusSpan.textContent = user.status;
        statusSpan.className = `status ${user.status}`;
        
        userDiv.appendChild(h1);
        userDiv.appendChild(h2);
        userDiv.appendChild(statusSpan);
        
        userStatusDiv.appendChild(userDiv);
    });
};

socket.onclose = function(event) {
  // Handle connection close
};

function sendMessage(message) {
  socket.send(message);
}