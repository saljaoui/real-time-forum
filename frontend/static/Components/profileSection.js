import { createElementWithClass } from '/static/utils/utils.js';
import {fetchProfileData}  from '../main.js'

export function createProfileSection() {

    const profileContainer = createElementWithClass('div', 'profile-container');

    const profileHeader = createElementWithClass('div', 'profile-header');
    const profileAvatar = createElementWithClass('div', 'profile-avatar');
    profileHeader.appendChild(profileAvatar);

    const profileInfo = createElementWithClass('div', 'profile-info');

    let user = JSON.parse(localStorage.getItem("user"))

    const profileName = createElementWithClass('h1', 'profile-name', `${user.message.firstname} ${user.message.lastname}`);
    const profileEmail = createElementWithClass('div', 'profile-email', `email: ${user.message.email}`);
    const profileNickname = createElementWithClass('div', 'profile-email', `Nickname: ${user.message.nickName}`);

    profileInfo.appendChild(profileName);
    profileInfo.appendChild(profileEmail);
    profileInfo.appendChild(profileNickname);
    
    const profileTabs = createElementWithClass('div', 'profile-tabs');
    const postsTab = createElementWithClass('div', 'tab active', 'Posts');
    const likesTab = createElementWithClass('div', 'tab', 'Likes');
    profileTabs.appendChild(postsTab);
    profileTabs.appendChild(likesTab);

    addEvent(postsTab, likesTab)
    fetchProfileData("Posts")
    
    profileContainer.appendChild(profileHeader);
    profileContainer.appendChild(profileInfo);
    profileContainer.appendChild(profileTabs);
    
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
