package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	messagings "forum-project/backend/internal/repository/messaging"
)

func GetMessageHistory(w http.ResponseWriter, r *http.Request) {
	var msg messagings.Message

	receiverIdStr := r.URL.Query().Get("receiverId")
	page := r.URL.Query().Get("page")
	fmt.Println(page)

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

	msgs := msg.GetMessageHistory(page)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(msgs); err != nil {
		JsoneResponse(w, r, err.Error(), http.StatusInternalServerError)
		return
	}
}
