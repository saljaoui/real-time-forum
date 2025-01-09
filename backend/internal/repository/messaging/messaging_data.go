package messagings

import (
	"fmt"

	"forum-project/backend/internal/database"
)

func inserMessages(user_id int, content string, user_reciever int) {
	query := "INSERT INTO messasges(user_id, content, user_id_receiver) VALUES(?,?,?);"
	_, err := database.Exec(query, user_id, content, user_reciever)
	if err != nil {
		fmt.Println("error to insert")
	}
}
