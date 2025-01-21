import { createElementWithClass, getTimeDifferenceInHours } from '/static/utils/utils.js';
import { actions, noDataYet} from '/static/Components/homeSection.js'

export function commentCard(data, mainContent) {
    if (noDataYet(data, mainContent, 'The Are No Comment')) { return; }
    
    const commentsList = createElementWithClass('div', 'comments-list');
    
    if (data && data.length > 0) {
        data.forEach(comment => {
            const commentCard = createElementWithClass('div', 'comment-card');
            
            const author = createElementWithClass('div', 'comment-author');
            const avatar = createElementWithClass('div', 'comment-avatar');
            const authorInfo = createElementWithClass('div', 'comment-author-info');
            const authorName = createElementWithClass('div', 'comment-author-name', 
                `${comment.firstName} ${comment.lastName}`);
            const timeAgo = createElementWithClass('div', 'comment-time', 
                `${getTimeDifferenceInHours(comment.date)}`);
            
            authorInfo.appendChild(authorName);
            authorInfo.appendChild(timeAgo);
            author.appendChild(avatar);
            author.appendChild(authorInfo);

            const content = createElementWithClass('p', 'comment-content', 
                `${comment.content}`);

            commentCard.appendChild(author);
            commentCard.appendChild(content);
            commentCard.appendChild(actions(comment));
            commentsList.appendChild(commentCard);

        });
    }

    return commentsList
}