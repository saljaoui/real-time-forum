import { createElementWithClass, getTimeDifferenceInHours } from '/static/utils/utils.js';
import { creatPost, fetchCard } from '../main.js'
import { msg } from '/static/Components/rightSidebar.js';


export function createHome() {
    msg.receiverId = 0;
    const createNewPost = createElementWithClass('div', 'create-new-post');
    const newPost = createElementWithClass('div', 'new-post');
    const textarea = createElementWithClass('textarea');
    textarea.setAttribute('placeholder', 'Add a new post...');
    const addPostBtn = createElementWithClass('div', 'add-post-btn', '+');

    newPost.appendChild(textarea);
    newPost.appendChild(addPostBtn);

    const categoriesContent = createElementWithClass('div', 'categories-content');
    const categoriesList = createElementWithClass('div', 'categories-list');

    addPostBtn.addEventListener('click', () => {
        if (categoriesList.classList.contains('active')) {
            categoriesList.classList.remove('active');
            addPostBtn.textContent = '+'
        } else {
            categoriesList.classList.add('active');
            addPostBtn.textContent = '-'
        }
    });

    const categories = [
        'General', 'Technology', 'Sports', 'Entertainment', 'Science',
        'Health', 'Food', 'Travel', 'Fashion', 'Art', 'Music'
    ];

    categories.forEach(category => {
        const categoryItem = createElementWithClass('div', 'category-item', category);
        categoriesList.appendChild(categoryItem);
        categoriesItemsEvent(categoryItem)
    });

    const createPostBtn = createElementWithClass('button', 'create-post-btn', 'Create Post');
    createPostBtn.style.display = 'none';
    createPostEvent(createPostBtn, textarea, categoriesList);

    categoriesContent.appendChild(categoriesList);
    categoriesContent.appendChild(createPostBtn);
    createNewPost.appendChild(newPost);
    createNewPost.appendChild(categoriesContent);

    return createNewPost;
}

function createPostEvent(createPostBtn, textarea, categoriesList) {
    createPostBtn.addEventListener('click', () => {
        const selectedCategories = Array.from(categoriesList.querySelectorAll('.category-item.selected'));
        const categories = selectedCategories.map(categorie => categorie.textContent);
        selectedCategories.forEach(categorie => categorie.classList.remove('selected'));
        creatPost(categories, textarea.value)
        textarea.value = ''
    })
}

export function postCard(data, mainContent) {

    if (noDataYet(data, mainContent, 'The Are No Posts')) { return; }
    if (typeof data === 'object' && !Array.isArray(data)) { data = [data]} 
    
    data.map(ele => {

        const postCard = createElementWithClass('div', 'post-card');

        const author = createElementWithClass('div', 'author');
        const avatar = createElementWithClass('div', 'avatar');
        const authorInfo = createElementWithClass('div');
        const authorName = createElementWithClass('div', '', `${ele.firstName} ${ele.lastName}`);
        const timeAgo = createElementWithClass('div', '', `${getTimeDifferenceInHours(ele.date)}`);
        timeAgo.style.fontSize = '0.875rem';
        timeAgo.style.color = '#6b7280';

        authorInfo.appendChild(authorName);
        authorInfo.appendChild(timeAgo);
        author.appendChild(avatar);
        author.appendChild(authorInfo);

        const postContent = createElementWithClass('p', '', `${ele.content}`);
        postContent.style.color = '#4b5563';

        postCard.appendChild(author);
        postCard.appendChild(postContent);
        postCard.appendChild(actions(ele));
        mainContent.appendChild(postCard);
    })
}

export function actions(ele) {
    const postActions = createElementWithClass('div', 'post-actions');
    const actions = [
        { icon: `<path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"</path>`, className: "likes", span: ele.likes },
        { icon: `<path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"</path>`, className: "dislikes", span: ele.dislikes },
        { icon: `<path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"</path>`, className: "comments", span: ele.comments },
    ];

    actions.forEach(action => {
        const actionDiv = createElementWithClass('div', `action ${action.className}`);
        actionDiv.setAttribute('data-card-id', ele.id);
        actionDiv.setAttribute('data-action', action.className)

        actionDiv.innerHTML = `
        <svg width="17" height="17" viewBox="0 0 20 20">
            ${action.icon}
        </svg>
        <span>${action.span}</span>
    `;

        actionEvent(actionDiv)
        postActions.appendChild(actionDiv);
    });

    setTimeout(() => {
        getUsrActions(ele.id);
    }, 100);

    return postActions;
}

export function noDataYet(data, mainContent, msg) {
    if (data == null || data.length === 0) {
        const noPostsCard = createElementWithClass('div', 'post-card no-posts');
        const messageWrapper = createElementWithClass('div', 'no-posts-message');

        const icon = createElementWithClass('div', 'no-posts-icon');
        icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
        `;

        const text = createElementWithClass('h3', 'no-posts-text', msg);

        messageWrapper.appendChild(icon);
        messageWrapper.appendChild(text);
        noPostsCard.appendChild(messageWrapper);
        mainContent.appendChild(noPostsCard);
        return true
    }
}

async function getUsrActions(cardId) {
    let response = await fetch(`/api/getUserReaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            cardId: +cardId
        }),
    });

    if (response.ok) {
        let data = await response.json();

        const likeBtn = document.querySelector(`[data-card-id="${cardId}"][data-action="likes"]`);
        const dislikeBtn = document.querySelector(`[data-card-id="${cardId}"][data-action="dislikes"]`);

        likeBtn.classList.toggle('active', data.userReaction === 1);
        dislikeBtn.classList.toggle('active', data.userReaction === -1);
    }
}

function actionEvent(actionDiv) {
    actionDiv.addEventListener('click', async () => {
        let action = actionDiv.getAttribute('data-action');
        let cardId = actionDiv.getAttribute('data-card-id');

        let reactionType = 0
        
        if (action === 'comments') { fetchCard(cardId)}
        if (action === 'likes') { reactionType = 1 }
        if (action === 'dislikes') { reactionType = -1 }
        if (reactionType === 0) { return }

        let response = await fetch(`/api/reaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                cardId: +cardId,
                reactionType: reactionType,
            }),
        });

        if (response.ok) {
            let data = await response.json();

            const likeBtn = document.querySelector(`[data-card-id="${cardId}"][data-action="likes"]`);
            const dislikeBtn = document.querySelector(`[data-card-id="${cardId}"][data-action="dislikes"]`);

            likeBtn.querySelector('span').textContent = data.likesCount;
            dislikeBtn.querySelector('span').textContent = data.dislikesCount;

            likeBtn.classList.toggle('active', data.userReaction === 1);
            dislikeBtn.classList.toggle('active', data.userReaction === -1);

        }


    });
}

function categoriesItemsEvent(navItem) {
    navItem.addEventListener('click', () => {
        if (navItem.classList.contains('selected')) {
            navItem.classList.remove('selected')
        } else {
            navItem.classList.add('selected');
        }
    });
}
