package comment

import (
	"forum-project/backend/internal/repository/cards"
)

type Comment struct {
	ID        int    `json:"id"`
	User_Id   int    `json:"user_id"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdat"`
	Card_Id   int    `json:"card_id"`
	Target_Id int    `json:"target_id"`
}

type comment_View struct {
	Id  int				`json:"id"`
	User_Id  int		`json:"userid"`
	Content   string	`json:"content"`
	CreatedAt string	`json:"date"`
	FirstName string	`json:"firstName"`
	LastName  string	`json:"lastName"`
	Likes 	  int		`json:"likes"`
	DisLikes  int		`json:"dislikes"`
	Comments  int		`json:"comments"`
}

func NewComment(user_id int, content string, target int) *Comment {
	return &Comment{
		ID:        -1,
		Card_Id:   -1,
		Target_Id: target,
		User_Id:   user_id,
		Content:   content,
	}
}

func (c *Comment) Add() int {
	card := cards.NewCard(c.User_Id, c.Content)
	card.Add()
	if card.Id == -1 {
		return -1
	}
	c.Card_Id = card.Id
	c.ID = insertComment(c.Card_Id, c.Target_Id)
	return c.ID
}

func GetComment(id int) *Comment {
	data_Row := getCommentById(id)
	if data_Row == nil {
		return nil
	}
	card := cards.GetCard(data_Row.Card_Id)
	if card == nil {
		return nil
	}
	newComment := &Comment{
		ID:        data_Row.ID,
		Card_Id:   data_Row.Card_Id,
		Target_Id: data_Row.Target_Id,
		Content:   card.Content,
		User_Id:   card.User_Id,
		CreatedAt: card.CreatedAt,
	}
	return newComment
}

func GetAllCommentsbyTarget(target int) []comment_View {
	list_Comments := make([]comment_View, 0)
	list := getAllCommentsbyTargetId(target)
	size := len(list)
	if size == 0 {
		return nil
	}
	for index := 0; index < size; index++ {
		comment := convert(list[index])
		list_Comments = append(list_Comments, comment)
	}
	return list_Comments
}

func convert(data_Row comment_Row_View) comment_View {
	comment := comment_View{}
	comment.Id = data_Row.Id
	comment.User_Id = data_Row.User_Id
	comment.Content = data_Row.Content
	comment.CreatedAt = data_Row.CreatedAt
	comment.FirstName = data_Row.FirstName
	comment.LastName = data_Row.LastName
	comment.Likes = data_Row.Likes
	comment.DisLikes = data_Row.DisLikes
	comment.Comments = data_Row.Comments
	return comment
}
