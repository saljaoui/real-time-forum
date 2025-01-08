package category

import (
	post "forum-project/backend/internal/repository/posts"
)

type Category struct {
	Category string `json:"Category"`
}

func AddCategory(post_id int, category string) error {
	err := postCategory(post_id, category)
	if err != nil {
		return err
	}
	return nil
}

func GetPostsByCategoryId(categoryName string) []post.PostResponde {
	query := `
	SELECT c.id,
    c.user_id,
    p.id,
    c.content,
    c.created_at,
    u.firstname,
    u.lastname,count(cm.id) comments
			FROM card c JOIN post p on c.id = p.card_id LEFT JOIN comment cm
			ON c.id = cm.target_id JOIN user u ON c.user_id = u.id
            JOIN post_category pc on pc.post_id=p.id 
            JOIN category cat on cat.id=pc.category_id
            WHERE cat.name = "` + categoryName + "\" GROUP BY c.id  ORDER BY c.id DESC"
	return post.GetPosts(query)
}
