import { createElementWithClass } from '/static/utils/utils.js';
import { switchSection } from '../main.js'

export function leftSidebar() {
    const sidebarLeft = createElementWithClass('div', 'sidebar-left');
    
    const universityLogo = createElementWithClass('div', 'university-logo');
    const logoBox = createElementWithClass('div', 'logo-box', 'D');
    const universityName = createElementWithClass('span', 'university-name', 'Diprella');
    
    universityLogo.appendChild(logoBox);
    universityLogo.appendChild(universityName);
    
    const nav = createElementWithClass('nav');
    
    const navItems = [
        { 
            icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`, 
            label: 'Home'
        },
        { 
            icon: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`, 
            label: 'Profile' 
        },
        { 
            icon: `<path d="M3 3h7v7H3z"></path><path d="M14 3h7v7h-7z"></path><path d="M3 14h7v7H3z"></path><path d="M14 14h7v7h-7z"></path>`, 
            label: 'Categories' 
        },
        { 
            icon: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>`, 
            label: 'Log out' 
        }
    ];
    
    navItems.forEach(item => {
        const navItem = createElementWithClass('div', 'nav-item');
        navItem.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${item.icon}
            </svg>
            <span>${item.label}</span>
        `;
        navItemsEvent(navItem, nav)
        nav.appendChild(navItem);
    });

    const lastNavItem = nav.querySelector('.nav-item:last-child');
    lastNavItem.classList.add('logout');

    sidebarLeft.appendChild(universityLogo);
    sidebarLeft.appendChild(nav);

    return sidebarLeft;
}


function navItemsEvent(navItem, nav) {

    navItem.addEventListener('click', () => {
            nav.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');

            });
            
        navItem.classList.add('active');
        switchSection(navItem.innerText)
        
    });

}
