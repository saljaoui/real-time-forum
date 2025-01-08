package handlers

import (
	"encoding/json"
	"net/http"

	like "forum-project/backend/internal/repository/likes"
)

func HandelLike(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode("Status Method Not Allowed")
		return
	}
	id_user := GetUserId(r)
	like := like.Like{}
	decode := DecodeJson(r)
	err := decode.Decode(&like)
	if err != nil {
		JsoneResponse(w, r, err.Error(), http.StatusBadRequest)
		return
	}
	like.User_Id = id_user
	m := like.Add()
	if m.MessageError != "" {
		JsoneResponse(w, r, m.MessageError, http.StatusBadRequest)
		return
	}
	JsoneResponse(w, r, m.MessageSucc, http.StatusCreated)
}

func HandelDeletLike(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode("Status Method Not Allowed")
		return
	}
	like := like.DeletLikes{}
	id_user := GetUserId(r)
	decode := DecodeJson(r)
	err := decode.Decode(&like)
	if err != nil {
		JsoneResponse(w, r, "Error of the Decode likes", http.StatusBadRequest)
		return
	}
	like.User_Id = id_user
	like.DeletLike()
	JsoneResponse(w, r, "DELETED Like", http.StatusCreated)
}
