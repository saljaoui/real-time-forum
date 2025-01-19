package messagings

import "time"

type Messaging struct {
	Sender_id   int    `json:"user_id"`
	Content     string `json:"content"`
	Reciever_id int    `json:"user_id_reciever"`
	Time        time.Time `json:"time"`
	Type string `json:"type"`
}

type Message struct {
	Type       string    `json:"type"` // "message", "status", "typing", etc.
	SenderId   int       `json:"senderId"`
	ReceiverId int       `json:"receiverId"`
	Content    string    `json:"content"`
	Timestamp  time.Time `json:"timestamp"`
}

func (m *Message) AddMessages() {
	inserMessage(m.SenderId, m.ReceiverId, m.Content, m.Timestamp)
}

func (m *Messaging) AddMessage() {
	inserMessages(m.Sender_id, m.Content, m.Reciever_id, m.Time)
}

func CheckUser(userId int) bool {
	return checkifuserexist(userId)
}
