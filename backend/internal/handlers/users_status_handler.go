package handlers

import (
	"encoding/json"
	"net/http"
	user "forum-project/backend/internal/repository/users"

)

func HandleUsersStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")  // Allow all origins
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Content-Type", "application/json")

    // Handle preflight requests
    if r.Method == "OPTIONS" {
        return
    }
	userId := GetUserId(r)
	users := user.GetUsersStatus(userId)
	json.NewEncoder(w).Encode(users)
}
