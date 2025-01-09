package messagings

type Messaging struct {
	User_id int `json:"user_id"`
	Content string `json:"content"`
	User_id_reciever int `json:"user_id_reciever"`
}

func (m *Messaging) AddMessage() {
	inserMessages(m.User_id, m.Content, m.User_id_reciever)
}