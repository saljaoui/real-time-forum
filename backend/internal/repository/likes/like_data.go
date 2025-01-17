package like

import (
	"fmt"

	"database/sql"
	messages "forum-project/backend/internal/Messages"
	"forum-project/backend/internal/database"
)

func inserReaction(UserID, CardID, ReactionType int) (m messages.Messages) {

	existingReaction := isReactionExists(UserID, CardID)

	if existingReaction == ReactionType {
		query := `
            DELETE FROM likes
            WHERE user_id = ? AND card_id = ?
        `
		_, err := database.Exec(query, UserID, CardID)
		if err != nil {
			m.MessageError = "Error removing reaction: " + err.Error()
			return m
		}
		m.MessageSucc = "Reaction removed"
		return m
	}

	if existingReaction == 0 {
		query := `
            INSERT INTO likes (user_id, card_id, reaction_type)
            VALUES (?, ?, ?)
        `
		_, err := database.Exec(query, UserID, CardID, ReactionType)
		if err != nil {
			m.MessageError = "Error adding reaction: " + err.Error()
			return m
		}
		m.MessageSucc = "Reaction added"
		return m
	}

	query := `
        UPDATE likes
        SET reaction_type = ?
        WHERE user_id = ? AND card_id = ?
    `
	_, err := database.Exec(query, ReactionType, UserID, CardID)
	if err != nil {
		m.MessageError = "Error updating reaction: " + err.Error()
		return m
	}

	m.MessageSucc = "Reaction updated"
	return m
}

func isReactionExists(UserID, CardID int) int {
	var existingReaction int
	query := `
        SELECT reaction_type FROM likes 
        WHERE user_id = ? AND card_id = ?
    `
	err := database.SelectOneRow(query, UserID, CardID).Scan(&existingReaction)
	if err == sql.ErrNoRows {
		return 0
	}
	if err != nil {
		return 0
	}
	return existingReaction
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

func GetReactionCounts(CardID int) (likes, dislikes int) {
	query := `
        SELECT 
            SUM(reaction_type = 1) as likes_count,
            SUM(reaction_type = -1) as dislikes_count
        FROM likes
        WHERE card_id = ?
    `
	err := database.SelectOneRow(query, CardID).Scan(&likes, &dislikes)
	if err != nil {
		return 0, 0
	}
	return likes, dislikes
}

func GetUserReaction(userID, cardID int) int {
	query := `
        SELECT reaction_type
        FROM likes 
        WHERE user_id = ? AND card_id = ?
        LIMIT 1
    `

	var reactionType int
	err := database.SelectOneRow(query, userID, cardID).Scan(&reactionType)

	if err == sql.ErrNoRows {
		return 0
	}
	if err != nil {
		return 0
	}

	return reactionType
}
