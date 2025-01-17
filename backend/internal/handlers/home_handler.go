package handlers

import (
	"encoding/json"
	"net/http"

	"forum-project/backend/internal/repository/cards"
)

type PaginatedResponse struct {
	Posts        []cards.Card_View_Data `json:"posts"`
	TotalPosts   int                    `json:"totalPosts"`
	TotalPages   int                    `json:"totalPages"`
	CurrentPage  int                    `json:"currentPage"`
	PostsPerPage int                    `json:"postsPerPage"`
}

func HomeHandle(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodGet {
		JsoneResponse(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	posts := cards.GetAllCards()

	json.NewEncoder(w).Encode(posts)
}
