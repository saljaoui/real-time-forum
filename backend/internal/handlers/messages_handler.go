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
	Type string `json:"type"`
	UserId int `json:"userid"`
	Status string `json:"status"`
}

type userNotif struct {
	Type string `json:"type"`
	UserIdS int `json:"userids"`
	UserIdR int `json:"useridr"`
}

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

	ws.mu.Lock()
	ws.usersConn[userId] = conn
	repository.UpdateStatusUser(userId, "online")
	ws.handleStatusUsers("online", userId)
	ws.mu.Unlock()

	defer func() {
		conn.Close()
		ws.mu.Lock()
		delete(ws.usersConn, userId)
		repository.UpdateStatusUser(userId, "offline")
		ws.handleStatusUsers("offline", userId)
		ws.mu.Unlock()
	}()

	ws.readLoop(userId)
}

func (ws *WS) readLoop(userId int) {

	ws.mu.RLock()
	conn := ws.usersConn[userId]
	repository.UpdateStatusUser(userId, "online")
	ws.handleStatusUsers("online", userId)
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
	ws.handleNotif(msg.SenderId, msg.ReceiverId)
	ws.mu.RLock()
	if recipientConn, ok := ws.usersConn[msg.ReceiverId]; ok {

		err := recipientConn.WriteJSON(msg)
		if err != nil {
			log.Printf("Error sending message to user %d: %v", msg.ReceiverId, err)
		}
	}
	ws.mu.RUnlock()
}

func (ws *WS) handleStatusUsers(sts string, userId int) {
	var userstr  userStuts
	userstr.UserId = userId
	userstr.Status = sts
	userstr.Type = "status"
	for _, v := range ws.usersConn {
		err := v.WriteJSON(userstr)
		if err != nil {
			log.Printf("Error updating status")
		}
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
