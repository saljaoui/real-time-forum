package home

import "time"

type PostResponde struct {
	Card_Id      int
	Post_Id      int
	UserID       int
	FirstName    string
	LastName     string
	Title        string
	Content      string
	Likes        int
	Dislikes     int
	CreatedAt    time.Time
}
