package messagings

import "time"

type Message struct {
	Type       string    `json:"type"` // "message", "status", "typing", etc.
	SenderId   int       `json:"senderId"`
	ReceiverId int       `json:"receiverId"`
	Content    string    `json:"content"`
	Notif      string    `json:"notif"`
	Timestamp  time.Time `json:"timestamp"`
}

func (m *Message) AddMessages() {
	inserMessage(m.SenderId, m.ReceiverId, m.Content, m.Timestamp)
}

func (m *Message) GetMessageHistory(page string) []Message {
	return getMessageHistory(m.SenderId, m.ReceiverId, page)
}

func CheckUser(userId int) bool {
	return checkifuserexist(userId)
}
