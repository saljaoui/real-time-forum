package handlers

import (
	"encoding/json"
	"net/http"

	like "forum-project/backend/internal/repository/likes"
)

func HandleReaction(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode("Status Method Not Allowed")
		return
	}

	var request like.LikeRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	request.UserId = GetUserId(r)

	m := request.AddReaction()
	if m.MessageError != "" {
		JsoneResponse(w, r, m.MessageError, http.StatusBadRequest)
		return
	}

	var response like.LikeResponse
	response.LikesCount, response.DislikesCount = like.GetReactionCounts(request.CardID)
	response.UserReaction = like.GetUserReaction(request.UserId, request.CardID)

	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
		return
	}
}

func HandlegetUserReaction(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode("Status Method Not Allowed")
		return
	}

	var request like.ReactionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	UserID := GetUserId(r)

	request.UserReaction = like.GetUserReaction(UserID, request.CardID)

	err := json.NewEncoder(w).Encode(request)
	if err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
		return
	}
}
