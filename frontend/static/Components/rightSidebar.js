import { createElementWithClass } from '/static/utils/utils.js';

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

    users.appendChild(usersHeader);
    users.appendChild(attendeesList);
    
    sidebarRight.appendChild(topBar);
    sidebarRight.appendChild(users);

    return sidebarRight;
}
