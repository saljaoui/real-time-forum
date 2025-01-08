package posts

import (
	"fmt"

	"forum-project/backend/internal/database"
)

func inserPost(title string, card_id int) int64 {
	query := "INSERT INTO post(title, card_id) VALUES(?,?);"
	row, err := database.Exec(query, title, card_id)
	if err != nil {
		fmt.Println("error to insert")
	}
	id, err := row.LastInsertId()
	if err != nil {
		fmt.Println("Error to get id ")
	}
	return id
}
