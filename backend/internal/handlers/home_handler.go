package handlers

import (
	"encoding/json"
	"net/http"

	"forum-project/backend/internal/repository/cards"
)

func HomeHandle(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodGet {
		JsoneResponse(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	posts := cards.GetAllCards()

	json.NewEncoder(w).Encode(posts)
}
