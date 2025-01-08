package like

import (
	"fmt"
	"strconv"

	messages "forum-project/backend/internal/Messages"
	"forum-project/backend/internal/database"
)

func inserLike(user_id, card_id, is_liked int, UserLiked, Userdisliked bool) (m messages.Messages) {
	if likeExists(user_id, card_id) {
		query := `DELETE FROM likes WHERE user_id = ? AND card_id = ?`
		_, err := database.Exec(query, user_id, card_id)
		if err != nil {
			fmt.Println(err.Error())
		}
	}
	query := "INSERT INTO likes(user_id, card_id, is_like, UserLiked, Userdisliked) VALUES(?,?,?,?,?);"
	_, err := database.Exec(query, user_id, card_id, is_liked, UserLiked, Userdisliked)
	if err != nil {
		fmt.Println(err.Error())
	}
	m.MessageSucc = "is liked"
	return m
}

func deletLike(user_id, card_id int) {
	query := "DELETE FROM likes WHERE user_id=? AND card_id=?"
	_, err := database.Exec(query, user_id, card_id)
	if err != nil {
		 
		fmt.Println(err.Error(), "test")
	}
}

func GetuserLiked(card_id int) []ResponseUserLikeds {
	querylike := `SELECT l.UserLiked , l.Userdisliked , u.UUID FROM likes l JOIN card c 
    on l.card_id=c.id JOIN user u ON u.id=l.user_id  WHERE  l.card_id =? `

	likesusers := []ResponseUserLikeds{}
	rows := database.SelectRows(querylike, card_id)
	for rows.Next() {
		likes := ResponseUserLikeds{}
		err := rows.Scan(&likes.UserLiked, &likes.UserDisliked, &likes.Uuid)
		if err != nil {
			fmt.Println(err)
		}
		likesusers = append(likesusers, likes)
	}
	return likesusers
}

func GetLikes(post_id int) (int, int, int, int) {
	querylike := `SELECT  COALESCE(UserLiked,0), COALESCE(Userdisliked,0) , COALESCE(SUM(l.is_like), 0)  FROM post
	 p, likes l WHERE p.card_id = l.card_id AND l.is_like = 1 AND p.id = ` + strconv.Itoa(post_id)
	like := 0
	UserLiked := 0
	UserdiLiked := 0
	Userdisliked := 0
	db := database.Config()
	err := db.QueryRow(querylike).Scan(&UserLiked, &Userdisliked, &like)
	if err != nil {
		fmt.Println(err)
		like = 0
	}
	querydislike := `SELECT COALESCE(UserLiked,0) ,COALESCE(Userdisliked,0) , COALESCE(SUM(l.is_like), 0) FROM 
	post p, likes l WHERE p.card_id = l.card_id AND l.is_like = -1 AND p.id = ` + strconv.Itoa(post_id)
	dislike := 0

	err = db.QueryRow(querydislike).Scan(&UserdiLiked, &Userdisliked, &dislike)
	if err != nil {
		dislike = 0
	}
	return like, dislike * -1, UserLiked, Userdisliked
}

func likeExists(user_id, card_id int) bool {
	var exists bool
	query := "SELECT EXISTS (select is_like from likes where user_id = ? AND card_id = ?)"
	err := database.SelectOneRow(query, user_id, card_id).Scan(&exists)
	if err != nil {
		fmt.Println("Error exist Like", err)
	}
	return exists
}
