package handlers

import (
	"encoding/json"
	"fmt"
	messagings "forum-project/backend/internal/repository/messaging"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader2 = websocket.Upgrader{
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
	// Listen for incoming messages
	for {
		// Read message from the client
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}
		var msg messagings.Messaging
		err = json.Unmarshal(message, &msg)
		if err != nil {
			fmt.Println(err.Error())
		}
		msg.AddMessage()
		// fmt.Println(message)
		fmt.Println(msg.User_id)
		// fmt.Printf("Received: %s\\n", message)
		// Echo the message back to the client
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			fmt.Println("Error writing message:", err)
			break
		}
	}
}
