package handlers

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	messagings "forum-project/backend/internal/repository/messaging"
	repository "forum-project/backend/internal/repository/users"


	"github.com/gorilla/websocket"
)

type WS struct {
	upgrader  websocket.Upgrader
	usersConn map[int]*websocket.Conn
	mu        sync.RWMutex
}

func NewWS() *WS {
	return &WS{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		usersConn: make(map[int]*websocket.Conn),
		mu:        sync.RWMutex{},
	}
}

func (ws *WS) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Websocket upgrade error: %v", err)
		return
	}

	userId := GetUserId(r)

	var sts repository.Status
	ws.mu.Lock()
	ws.usersConn[userId] = conn
	ws.handleStatusUsers(sts, userId)
	ws.mu.Unlock()
	fmt.Println("heeeeeeeer")
	defer func() {
		conn.Close()
		ws.mu.Lock()
		delete(ws.usersConn, userId)
		// repository.UpdateStatusUser(userId, "offline")
		ws.handleStatusUsers(sts, userId)
		ws.mu.Unlock()
	}()

	ws.readLoop(userId)
}

func (ws *WS) readLoop(userId int) {
	// var sts repository.Status
	ws.mu.RLock()
	conn := ws.usersConn[userId]
	ws.mu.RUnlock()

	for {
		var msg messagings.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Error reading JSON: %v", err)
			}
			break
		}

		msg.SenderId = userId
		msg.Timestamp = time.Now()

		fmt.Println(msg)

		switch msg.Type {
		case "message":
			ws.handlePrivateMessage(msg)
			// case "status":
			// 	ws.handleStatusUsers(sts, userId)
		}
	}
}

func (ws *WS) handlePrivateMessage(msg messagings.Message) {
	msg.AddMessages()

	ws.mu.RLock()
	if recipientConn, ok := ws.usersConn[msg.ReceiverId]; ok {

		err := recipientConn.WriteJSON(msg)
		if err != nil {
			log.Printf("Error sending message to user %d: %v", msg.ReceiverId, err)
		}
	}
	ws.mu.RUnlock()
}

func (ws *WS) handleStatusUsers(sts repository.Status, userId int) {
	users := repository.GetUsersStatus(userId)
	sts.Type = "status"
	sts.UsersStatus = users
	for _, v := range ws.usersConn {
		if v != ws.usersConn[userId] {
			err := v.WriteJSON(sts)
			if err != nil {
				log.Printf("Error updating status")
			}
		}
	}
}
