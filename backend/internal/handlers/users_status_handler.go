package handlers

import (
	"encoding/json"
	"forum-project/backend/internal/database"
	"log"
	"net/http"
	"time"
)

type UserStatusResponse struct {
	ID        int       `json:"id"`
	Nickname  string    `json:"nickname"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Status    string    `json:"status"`
	LastSeen  time.Time `json:"lastSeen,omitempty"`
	Email     string    `json:"email"`
}

func HandleUsersStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	db := database.Config()

	query := `
		SELECT 
			id,
			nickname,
			firstname,
			lastname,
			email,
			status
		FROM user
		ORDER BY 
			CASE 
				WHEN status = 'online' THEN 1
				ELSE 2
			END,
			nickname ASC`

	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Query error: %v", err)
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []UserStatusResponse
	for rows.Next() {
		var user UserStatusResponse

		err := rows.Scan(
			&user.ID,
			&user.Nickname,
			&user.FirstName,
			&user.LastName,
			&user.Email,
			&user.Status,
		)

		if err != nil {
			log.Printf("Row scan error: %v", err)
			continue
		}

		if user.Status == "" {
			user.Status = "offline"
		}

		users = append(users, user)
	}

	json.NewEncoder(w).Encode(users)

}
