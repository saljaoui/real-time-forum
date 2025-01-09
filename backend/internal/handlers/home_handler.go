package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"forum-project/backend/internal/repository/cards"
	like "forum-project/backend/internal/repository/likes"
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

	page := 1
	pageStr := r.URL.Query().Get("page")
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	postsPerPage := 10

	posts, totalPosts := cards.GetAllCardsForPages(page, postsPerPage)

	totalPages := (totalPosts + postsPerPage - 1) / postsPerPage

	response := PaginatedResponse{
		Posts:        posts,
		TotalPosts:   totalPosts,
		TotalPages:   totalPages,
		CurrentPage:  page,
		PostsPerPage: postsPerPage,
	}

	json.NewEncoder(w).Encode(response)
}

func LikesHandle(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodPost {
		JsoneResponse(w, r, "Method Not Allowd", http.StatusMethodNotAllowed)
		return
	}
	liked := like.Like{}
	decode := DecodeJson(r)
	err := decode.Decode(&liked)
	if err != nil {
		JsoneResponse(w, r, err.Error(), http.StatusBadRequest)
		return
	}
	dislike := liked.ChecklikesUser()
	json.NewEncoder(w).Encode(dislike)
}
