package handlers

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	users "forum-project/backend/internal/repository/users"

	"github.com/gorilla/websocket"
)

func HandleUsersStatus(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader2.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "WebSocket upgrade failed", http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	userId := GetUserId(r)

	// Use defer for cleanup to ensure it happens in all cases
	defer func() {
		updateUserStatus(userId, false)
		usersConnMu.Lock()
		delete(usersConn, userId)
		usersConnMu.Unlock()
	}()

	// Register connection with proper error handling
	if err := updateUserStatus(userId, true); err != nil {
		return
	}

	usersConnMu.Lock()
	usersConn[userId] = conn
	usersConnMu.Unlock()

	// Add ping/pong handlers for connection health
	conn.SetPingHandler(func(string) error {
		return conn.WriteControl(websocket.PongMessage, []byte{}, time.Now().Add(time.Second))
	})

	// Message handling loop with timeout
	for {
		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		messageType, _, err := conn.ReadMessage()
		if err != nil {
			return
		}

		usersStatus := users.SelectUserStatus(userId)
		responseJson, err := json.Marshal(usersStatus)
		if err != nil {
			continue
		}

		conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
		if err := conn.WriteMessage(messageType, responseJson); err != nil {
			return
		}
	}
}

var dbMutex sync.Mutex

func updateUserStatus(userID int, online bool) error {
	dbMutex.Lock()
	defer dbMutex.Unlock()

	status := "offline"
	if online {
		status = "online"
	}

	return users.UpdateStatusUser(userID, status)
}
