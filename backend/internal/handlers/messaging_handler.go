package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	messagings "forum-project/backend/internal/repository/messaging"

	"github.com/gorilla/websocket"
)

var (
	usersConn   = make(map[int]*websocket.Conn)
	usersConnMu sync.Mutex
)

var upgrader2 = websocket.Upgrader{
	ReadBufferSize:   1024,
	WriteBufferSize:  1024,
	HandshakeTimeout: 500,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleMessaging(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader2.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}
	defer conn.Close()

	userId := GetUserId(r)
	
	// Register connection
	usersConnMu.Lock()
	usersConn[userId] = conn
	usersConnMu.Unlock()

	// Ensure user is removed from the map when they disconnect
	defer func() {
		usersConnMu.Lock()
		delete(usersConn, userId)
		usersConnMu.Unlock()
		fmt.Println("User disconnected:", userId)
	}()

	// Message handling loop
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}

		var msg messagings.Messaging
		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("Error unmarshaling JSON:", err)
			continue
		}

		// Assign sender ID
		msg.Sender_id = userId

		// Validate recipient user
		if !messagings.CheckUser(msg.Reciever_id) {
			fmt.Println("Recipient user does not exist:", msg.Reciever_id)
			continue
		}

		// Store message in database
		msg.AddMessage()

		// Send message back to sender
		msg.Type = "sender"
		responseJson, err := json.Marshal(msg)
		if err != nil {
			fmt.Println("Error marshaling JSON:", err)
			continue
		}

		if err := conn.WriteMessage(messageType, responseJson); err != nil {
			fmt.Println("Error writing message to sender:", err)
			break
		}

		// Send message to recipient if they're online
		usersConnMu.Lock()
		recieveConn, exists := usersConn[msg.Reciever_id]
		usersConnMu.Unlock()

		if exists {
			msg.Type = "receiver"
			reciverJson, _ := json.Marshal(msg)

			if err := recieveConn.WriteMessage(messageType, reciverJson); err != nil {
				fmt.Println("Error writing message to receiver:", err)
			}
		}
	}
}
