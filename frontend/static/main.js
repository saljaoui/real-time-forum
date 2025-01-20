import { leftSidebar } from './Components/leftSidebar.js';
import { rightSidebar } from './Components/rightSidebar.js';
import { createHome, postCard } from './Components/homeSection.js';
import { createElementWithClass, cleanUp, cleanCards, getCookie } from './utils/utils.js';
import { createProfileSection } from './Components/profileSection.js';
import { createCategories } from './Components/categoriesSection.js';
import { buildLoginPage } from './Components/loginSection.js';
import { commentCard } from './Components/commentSection.js';
import { handleAuthCheck } from './utils/utils.js';
import { closeSocket } from './Components/rightSidebar.js';


document.addEventListener('DOMContentLoaded', async () => {
    let isAuthenticated = await handleAuthCheck();

    if (isAuthenticated) {
        createDashboard();
    } else {
        buildLoginPage();
    }
});


export async function createDashboard() {

    const loginPage = document.body.querySelector('.login-page')
    loginPage?.remove()

    const dashboard = createElementWithClass('div', 'dashboard');
    const mainContent = createElementWithClass('div', 'main-content');

    mainContent.appendChild(createHome());
    
    let data = await fetchDataPosts()    
    postCard(data, mainContent)

    const sidebar = await rightSidebar();

    dashboard.appendChild(leftSidebar());
    dashboard.appendChild(mainContent);
    dashboard.appendChild(sidebar);
    document.body.appendChild(dashboard);
}

export async function switchSection(navItemName) {
    let mainContent = document.querySelector('.main-content')

    if (navItemName === "Profile") {
        cleanUp(mainContent)

        mainContent.appendChild(createProfileSection());

    } else if (navItemName === "Home") {
        cleanUp(mainContent)

        mainContent.appendChild(createHome());
        let data = await fetchDataPosts()
        postCard(data, mainContent)
    } else if (navItemName === "Categories") {
        cleanUp(mainContent)
        mainContent.appendChild(createCategories());

    } else if (navItemName === "Log out") {
        closeSocket()
        logout()
        cleanCards(".dashboard")
        buildLoginPage()
    }
}

async function fetchDataPosts() {
    const response = await fetch(`/api/home`, {
        method: "GET",
      });      
      if (response.ok) {
        const data =  await response.json();
        return data
      }
      
}

export async function fetchProfileData(Type) {
    const response = await fetch(`/api/profile/${Type.toLowerCase()}`, {
        method: "GET",
      });
      if (response.ok) {
        let mainContent = document.querySelector('.main-content')
        cleanCards('.post-card')
        const data = await response.json();
        postCard(data, mainContent)

      }
      
}

export async function fetchCategoriesData(categoryName) {

    const response = await fetch("/api/category", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: categoryName }),
    });
    
    let mainContent = document.querySelector('.main-content')
    cleanCards('.post-card')
    const data = await response.json();
    postCard(data, mainContent)
}

export async function fetchCard(cardId) {
    const response = await fetch(`/api/card?id=${cardId}`, {
        method: "GET",
    });
    if (response.ok) {
        let mainContent = document.querySelector('.main-content')
        cleanUp(mainContent)
        const data = await response.json();
        postCard(data, mainContent)
        let postcard = mainContent.querySelector('.post-card')
        let postActions = postcard.querySelector('.post-actions')
        postActions.classList.add('for-comment')
        postcard.classList.add('comment-page')
        const textarea = createElementWithClass('textarea');
        textarea.setAttribute('placeholder', 'Add a new comment...');
        const createPostBtn = createElementWithClass('button', 'create-comment-btn', 'Create Comment');
        postcard.appendChild(textarea)
        postcard.appendChild(createPostBtn)
        fetchComments(cardId)
        addEventCommentBtn(createPostBtn, cardId, textarea)
        
    
    }
}
function addEventCommentBtn(createPostBtn, cardId, textarea) {
    createPostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createComment(textarea.value, cardId)
        textarea.value = ''
    })
}

async function createComment(commentContent, cardId) {
    console.log(cardId);
    console.log(commentContent);
    
    
    const response = await fetch("/api/addcomment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            content: commentContent,
            target_id: +cardId
        })
    })

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        cleanCards('.comments-list')
        cleanCards('.no-posts')
        fetchComments(cardId)
    }
}

export async function fetchComments(cardId) {
    
    const response = await fetch(`/api/comment?target_id=${cardId}`, {
        method: "GET",
    });
    
    if (response.ok) {
        let mainContent = document.querySelector('.main-content')
        // cleanUp(mainContent)
        const data = await response.json()
        console.log("this",data);
        mainContent.appendChild(commentCard(data, mainContent))    
    }
}

export default async function logout() {

    let Useruuid = getCookie("token");
 
    const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid: Useruuid }),
    });
    
    if (response.ok) {
        console.log("Logout successful");
    } 
}

export async function creatPost(categoriesSelected, postContent) {
    const response = await fetch("/api/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            title: "title",
            content: postContent,
            name: categoriesSelected
        })
    })

    if (response.ok) {
        const data = await response.json()
        cleanCards('.post-card')
        let dataa = await fetchDataPosts()
        let mainContent = document.querySelector('.main-content')
        postCard(dataa, mainContent)
        console.log(data);
    }

}
