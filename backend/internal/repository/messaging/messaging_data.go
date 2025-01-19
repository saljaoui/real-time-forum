package messagings

import (
	"fmt"
	"time"

	"forum-project/backend/internal/database"
)

func inserMessage(SenderId, ReceiverId int, Content string, Timestamp time.Time) {
	query := "INSERT INTO messages(sender_id, receiver_id, message, sent_at) VALUES(?,?,?,?);"
	_, err := database.Exec(query, SenderId, ReceiverId, Content, Timestamp)
	if err != nil {
		fmt.Println("error to insert")
	}
}

func checkifuserexist(userId int) bool {
	var exists bool
	query := "SELECT EXISTS (select id from user where id = ?)"
	err := database.SelectOneRow(query, userId).Scan(&exists)
	if err != nil {
		fmt.Println("Error user not exist", err)
	}
	return exists
}