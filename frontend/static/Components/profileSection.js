import { createElementWithClass } from '/static/utils/utils.js';
import {fetchProfileData}  from '../main.js'

export function createProfileSection() {
    // Create profile container
    const profileContainer = createElementWithClass('div', 'profile-container');
    
    // Create profile header
    const profileHeader = createElementWithClass('div', 'profile-header');
    const profileAvatar = createElementWithClass('div', 'profile-avatar');
    profileHeader.appendChild(profileAvatar);
    
    // Create profile info
    const profileInfo = createElementWithClass('div', 'profile-info');
    const profileName = createElementWithClass('h1', 'profile-name', 'soufian soooo');
    const profileEmail = createElementWithClass('div', 'profile-email', 'soooo@gmail.com');
    profileInfo.appendChild(profileName);
    profileInfo.appendChild(profileEmail);
    
    // Create profile tabs 
    const profileTabs = createElementWithClass('div', 'profile-tabs');
    const postsTab = createElementWithClass('div', 'tab active', 'Posts');
    const likesTab = createElementWithClass('div', 'tab', 'Likes');
    profileTabs.appendChild(postsTab);
    profileTabs.appendChild(likesTab);

    addEvent(postsTab, likesTab)
    fetchProfileData("Posts")
    
    // Add all profile sections
    profileContainer.appendChild(profileHeader);
    profileContainer.appendChild(profileInfo);
    profileContainer.appendChild(profileTabs);

    // // Create post card
    
    
    // Add post card to profile container
    // profileContainer.appendChild(postCard());
    
    return profileContainer;
}

function addEvent(postsTab, likesTab) {
    postsTab.addEventListener('click', () => {
        toggleActiveTab(postsTab, likesTab);
    })
    likesTab.addEventListener('click', () => {
        toggleActiveTab(likesTab, postsTab);
    })
}

function toggleActiveTab(activeTab, inactiveTab) {
    fetchProfileData(activeTab.textContent)
    activeTab.classList.add('active');
    inactiveTab.classList.remove('active');
}
