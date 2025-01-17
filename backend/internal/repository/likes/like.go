package like

import (
	"errors"

	messages "forum-project/backend/internal/Messages"
)

type Like struct {
	ID           int  `json:"id"`
	User_Id      int  `json:"user_id"`
	Card_Id      int  `json:"card_id"`
	Is_Liked     int  `json:"is_liked"`
	Is_disliked  int  `json:"is_disliked"`
	UserLiked    bool `json:"userliked"`
	Userdisliked bool `json:"userdisliked"`
}

type LikeRequest struct {
	UserId int `json:"user_id"`
    CardID     int `json:"cardId"`
    ReactionType int `json:"reactionType"` // 1 for like, -1 for dislike, 0 for remove reaction
}

type LikeResponse struct {
    LikesCount    int `json:"likesCount"`
    DislikesCount int `json:"dislikesCount"`
    UserReaction  int `json:"userReaction"`
}

type ReactionRequest struct {
	CardID int `json:"cardId"`
	UserReaction int `json:"userReaction"` // 1 for like, -1 for dislik
}

type DeletLikes struct {
	User_Id int `json:"uuid"`
	Card_Id int `json:"card_id"`
}

type ResponseUserLikeds struct {
	UserLiked    bool
	UserDisliked bool
	Uuid         string
}

func NewLike(user_id, card_id int) *Like {
	return &Like{
		ID:       -1,
		User_Id:  user_id,
		Card_Id:  card_id,
		Is_Liked: -1,
	}
}

func (l *Like) SetIsLike(val int) error {
	if val < -1 || val > 1 {
		return errors.New("Like is a property that can be -1, 0 or 1")
	}
	l.Is_Liked = val
	return nil
}

func (l *Like) GetIsLike() int {
	return l.Is_Liked
}

func (p *LikeRequest) AddReaction() messages.Messages {
	m := inserReaction(p.UserId, p.CardID, p.ReactionType)
	return m
}


func (like *Like) ChecklikesUser() []ResponseUserLikeds {
	likes := GetuserLiked(like.Card_Id)
	return likes
}
