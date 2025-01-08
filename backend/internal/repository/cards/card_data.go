package cards

import (
	"forum-project/backend/internal/database"
)

type Card_Row struct {
	Id        int
	User_Id   int
	Content   string
	CreatedAt string
}

type Card_View_Data struct {
	Id        int    `json:"id"`
	User_Id   int    `json:"user_id"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdat"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Likes     int    `json:"likes"`
	DisLikes  int    `json:"dislikes"`
	Comments  int    `json:"comments"`
}


func insertCard(user_id int, content string) int {
	query := "INSERT INTO card(user_id,content) VALUES(?,?)"
	resl, _ := database.Exec(query, user_id, content)
	id, err := resl.LastInsertId()
	if err != nil {
		return -1
	}
	return int(id)
}

func getCardById(id int) *Card_Row {
	query := "SELECT * FROM card WHERE card.id =?;"
	myCard_Row := &Card_Row{}
	err := database.SelectOneRow(query, id).Scan(&id, &myCard_Row.User_Id, &myCard_Row.Content, &myCard_Row.CreatedAt)

	if err != nil {
		return nil
	} else {
		return myCard_Row
	}
}


func getCard(targetID  int) Card_View_Data {
	query := `SELECT c.id,c.user_id,c.content,c.created_at,u.firstname,u.lastname,
	 (SELECT count(*) FROM comment cm WHERE cm.target_id = c.id)
	 comments,(SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = 1)
	  likes , (SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = -1) dislikes
			FROM card c  JOIN user u ON c.user_id = u.id WHERE c.id = ?;`
	Row := Card_View_Data{}
	err := database.SelectOneRow(query,targetID).Scan(&Row.Id,&Row.User_Id,&Row.Content,
		&Row.CreatedAt,&Row.FirstName,&Row.LastName,&Row.Comments,&Row.Likes,&Row.DisLikes)
	if err != nil{
        return Card_View_Data{}
    }
	return Row
}

func getAllCards() []Card_View_Data {
	list_Cards := make([]Card_View_Data, 0)
	query := `SELECT c.id,c.user_id,c.content,c.created_at,u.firstname,u.lastname,
	 count(cm.id) comments,(SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = 1)
	  likes , (SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = -1) dislikes
			FROM card c JOIN post p on c.id = p.card_id LEFT JOIN comment cm
			ON c.id = cm.target_id JOIN user u ON c.user_id = u.id
			GROUP BY c.id  ORDER BY c.id DESC  `
	data_Rows := database.SelectRows(query)
	for data_Rows.Next(){
		Row := Card_View_Data{}
		err := data_Rows.Scan(&Row.Id,&Row.User_Id,&Row.Content,&Row.CreatedAt,&Row.FirstName,&Row.LastName,&Row.Comments,&Row.Likes,&Row.DisLikes)
		if err != nil {
			return nil
		}    
		list_Cards = append(list_Cards, Row)
	}
	return list_Cards
}

func getAllCardsForPages(page int, postsPerPage int) ([]Card_View_Data, int) {
    list_Cards := make([]Card_View_Data, 0)

    countQuery := `SELECT COUNT(DISTINCT c.id) 
                   FROM card c 
                   JOIN post p on c.id = p.card_id 
                   JOIN user u ON c.user_id = u.id`
    
    countRows := database.SelectRows(countQuery)
    var totalPosts int
    if countRows.Next() {
        err := countRows.Scan(&totalPosts)
        if err != nil {
            return nil, 0
        }
    }
    defer countRows.Close()

    offset := (page - 1) * postsPerPage

    query := `SELECT c.id, c.user_id, c.content, c.created_at, u.firstname, u.lastname,
              count(cm.id) comments,
              (SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = 1) likes,
              (SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = -1) dislikes
              FROM card c 
              JOIN post p on c.id = p.card_id 
              LEFT JOIN comment cm ON c.id = cm.target_id 
              JOIN user u ON c.user_id = u.id
              GROUP BY c.id  
              ORDER BY c.id DESC
              LIMIT ? OFFSET ?`
    
    data_Rows := database.SelectRows(query, postsPerPage, offset)
    defer data_Rows.Close()
    
    for data_Rows.Next() {
        Row := Card_View_Data{}
        err := data_Rows.Scan(&Row.Id, &Row.User_Id, &Row.Content, &Row.CreatedAt,
                             &Row.FirstName, &Row.LastName, &Row.Comments,
                             &Row.Likes, &Row.DisLikes)
        if err != nil {
            return nil, 0
        }    
        list_Cards = append(list_Cards, Row)
    }
    
    return list_Cards, totalPosts
}

