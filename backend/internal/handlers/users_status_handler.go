package handlers

import (
	"encoding/json"
	"net/http"

	user "forum-project/backend/internal/repository/users"
)

func HandleUsersStatus(w http.ResponseWriter, r *http.Request) {
	userId := GetUserId(r)
	users := user.GetUsersStatus(userId)
	json.NewEncoder(w).Encode(users)
}

func HandleUserId(w http.ResponseWriter, r *http.Request) {
	userId := GetUserId(r)
	json.NewEncoder(w).Encode(userId)
}