package handlers

import (
	"log"
	"net/http"
	"sync"
	"time"

	messagings "forum-project/backend/internal/repository/messaging"
	repository "forum-project/backend/internal/repository/users"

	"github.com/gorilla/websocket"
)

type userStuts struct {
	Type   string `json:"type"`
	UserId int    `json:"userid"`
	Status string `json:"status"`
}

type userNotif struct {
	Type    string `json:"type"`
	UserIdS int    `json:"userids"`
	UserIdR int    `json:"useridr"`
}

type WS struct {
	upgrader  websocket.Upgrader
	usersConn map[int]*websocket.Conn
	numcon    map[int]int
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
		numcon:    make(map[int]int),
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

	ws.mu.Lock()
	ws.usersConn[userId] = conn
	ws.numcon[userId]++
	repository.UpdateStatusUser(userId, "online")
	ws.handleStatusUsers("online", userId)
	ws.mu.Unlock()

	defer func() {
		conn.Close()
		ws.mu.Lock()
		ws.numcon[userId]--
		if ws.numcon[userId] == 0 {
			delete(ws.usersConn, userId)
			repository.UpdateStatusUser(userId, "offline")
			ws.handleStatusUsers("offline", userId)
		}
		ws.mu.Unlock()
	}()
	ws.readLoop(userId)
}

func (ws *WS) readLoop(userId int) {
	ws.mu.RLock()
	conn := ws.usersConn[userId]
	ws.mu.RUnlock()

	for {
		var msg messagings.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			break
		}

		msg.SenderId = userId
		msg.Timestamp = time.Now()

		switch msg.Type {
		case "message":
			ws.handlePrivateMessage(msg)
		case "refrech":
			ws.handleRefrechNewUser(msg, userId)
		}
	}
}

func (ws *WS) handlePrivateMessage(msg messagings.Message) {
	ws.mu.RLock()
	msg.AddMessages()

	if recipientConn, ok := ws.usersConn[msg.ReceiverId]; ok {
		ws.handleNotif(msg.SenderId, msg.ReceiverId)
		err := recipientConn.WriteJSON(msg)
		if err != nil {
			log.Printf("Error sending message to user %d: %v", msg.ReceiverId, err)
		}
	}

	ws.mu.RUnlock()
}

func (ws *WS) handleRefrechNewUser(msg messagings.Message, userId int) {
	msg.Type = "refrech"
	for _, v := range ws.usersConn {
		if v != ws.usersConn[userId] {
			v.WriteJSON(msg)
		}
	}
}

func (ws *WS) handleStatusUsers(sts string, userId int) {
	var userstr userStuts
	userstr.UserId = userId
	userstr.Status = sts
	userstr.Type = "status"
	for _, v := range ws.usersConn {
		v.WriteJSON(userstr)
	}
}

func (ws *WS) handleNotif(userSendId int, userRecieveId int) {
	var usrnotif userNotif
	usrnotif.Type = "notif"
	usrnotif.UserIdS = userSendId
	usrnotif.UserIdR = userRecieveId
	err := ws.usersConn[userRecieveId].WriteJSON(usrnotif)
	if err != nil {
		log.Printf("Error sending notifaction")
	}
}
