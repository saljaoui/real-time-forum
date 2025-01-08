package home

import (
	post "forum-project/backend/internal/repository/posts"
)

func GetPostsHome() []post.PostResponde {
	query := `SELECT p.card_id AS 'card_id', p.id, u.id AS 'user_id', u.firstname, u.lastname, p.title, c.content, c.created_at  
	FROM post p, card c, user u WHERE p.card_id=c.id 
	AND c.user_id=u.id ORDER BY c.created_at DESC`
	return post.GetPosts(query)
}

