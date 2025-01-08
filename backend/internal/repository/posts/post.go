package posts

import (
	"encoding/json"
	"fmt"
	"html"
	"net/http"

	"forum-project/backend/internal/database"
	"forum-project/backend/internal/repository/cards"
	like "forum-project/backend/internal/repository/likes"
)

type Post struct {
	ID            int      `json:"id"`
	User_Id       int      `json:"user_id"`
	Title         string   `json:"title"`
	Content       string   `json:"content"`
	Name_Category []string `json:"name"`
	CreatedAt     string   `json:"createdat"`
	Card_Id       int      `json:"card_id"`
}

type PostResponde struct {
	Card_Id      int    `json:"id"`
	Post_Id      int    `json:"post_id"`
	UserID       int    `json:"user_id"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Title        string `json:"title"`
	Content      string `json:"content"`
	Likes        int    `json:"likes"`
	Dislikes     int    `json:"dislikes"`
	UserLiked    int    `json:"userliked"`
	Userdisliked int    `json:"userdisliked"`
	Comments     string `json:"comments"`
	CreatedAt    string `json:"createdat"`
}

func (p *Post) Add() int {
	content := html.EscapeString(p.Content)
	title := html.EscapeString(p.Title)

	card := cards.NewCard(p.User_Id, content)
	card.Add()
	if card.Id == -1 {
		return -1
	}
	p.Card_Id = card.Id
	id_posr := inserPost(title, p.Card_Id)
	return int(id_posr)
}

func (p *Post) CheckPostErr(w http.ResponseWriter) {
	if p.Title == "" || p.Content == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid input")
	}
}

func GetPosts(query string) []PostResponde {
	db := database.Config()
	rows, err := db.Query(query)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var posts []PostResponde
	for rows.Next() {
		var post PostResponde
		err := rows.Scan(
			&post.Card_Id,
			&post.UserID,
			&post.Post_Id,
			&post.Content,
			&post.CreatedAt,
			&post.FirstName,
			&post.LastName,
			&post.Comments,
		)
		if err != nil {
			fmt.Println("er", err)
			return nil
		}
		likes, dislikes, userliked, Userdisliked := like.GetLikes(post.Post_Id)
		post.Likes = likes
		post.Dislikes = dislikes
		post.UserLiked = userliked
		post.Userdisliked = Userdisliked
		posts = append(posts, post)
	}
	return posts
}
