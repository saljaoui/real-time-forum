package messagings

import (
	"fmt"
	"strconv"
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
func getMessageHistory(SenderId, ReceiverId int, page string) []Message {
    var messages []Message
    
    pageNum, err := strconv.Atoi(page)
    if err != nil {
        fmt.Println("Error converting page to int:", err)
        return nil
    }
    
    query := `
        SELECT
            sender_id,
            receiver_id,
            message,
            sent_at
        FROM messages
        WHERE
            (sender_id = $1 AND receiver_id = $2)
            OR
            (sender_id = $2 AND receiver_id = $1)
        ORDER BY id DESC
        LIMIT $3 OFFSET $4`
    
    DB := database.Config()
    rows, err := DB.Query(query, SenderId, ReceiverId, 10, pageNum*10)
    if err != nil {
        fmt.Println("Database query error:", err) 
        return nil
    }
    defer rows.Close()
    
    for rows.Next() {
        var msg Message
        err := rows.Scan(&msg.SenderId, &msg.ReceiverId, &msg.Content, &msg.Timestamp)
        if err != nil {
            fmt.Println("Row scan error:", err)
            return nil
        }
        messages = append(messages, msg)
    }
    return messages
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
