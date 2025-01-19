package handlers

import (
	"encoding/json"
	"net/http"
	user "forum-project/backend/internal/repository/users"

)

func HandleUsersStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := GetUserId(r)
	users := user.GetUsersStatus(userId)
	json.NewEncoder(w).Encode(users)
}
