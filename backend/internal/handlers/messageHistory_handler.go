package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	messagings "forum-project/backend/internal/repository/messaging"
)

func GetMessageHistory(w http.ResponseWriter, r *http.Request) {
	var msg messagings.Message

	receiverIdStr := r.URL.Query().Get("receiverId")
	if receiverIdStr == "" {
		JsoneResponse(w, r, "receiverId is required", http.StatusBadRequest)
		return
	}

	receiverId, err := strconv.Atoi(receiverIdStr)
	if err != nil {
		JsoneResponse(w, r, "Invalid receiverId format", http.StatusBadRequest)
		return
	}

	userID := GetUserId(r)
	msg.SenderId = userID
	msg.ReceiverId = receiverId

	msgs := msg.GetMessageHistory()
	
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(msgs); err != nil {
		JsoneResponse(w, r, err.Error(), http.StatusInternalServerError)
		return
	}
}
