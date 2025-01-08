package comment

import "forum-project/backend/internal/database"

type comment_Row struct {
	ID        int
	User_Id   int
	Content   string
	CreatedAt string
	Card_Id   int
	Target_Id int
}

type comment_Row_View struct {
	Id  int				
	User_Id  int		
	Content   string	
	CreatedAt string
	FirstName string	
	LastName  string	
	Likes 	  int
	DisLikes  int
	Comments  int
}

func insertComment(card_id, target_id int) int {
	query := "INSERT INTO comment(card_id,target_id) VALUES(?,?);"
	resl, _ := database.Exec(query, card_id, target_id)
	id, err := resl.LastInsertId()
	if err != nil {
		return -1
	}
	return int(id)
}

func getCommentById(id int) *comment_Row {
    Row := comment_Row{}
    query := "SELECT * FROM comment WHERE comment.id =?;"
    err := database.SelectOneRow(query,id).Scan(&Row.ID,&Row.Card_Id,&Row.Target_Id)
    if err != nil{
        return nil
    }
    return &Row 
}

func getAllCommentsbyTargetId(target int) []comment_Row_View {
	list_Comments := make([]comment_Row_View, 0)
	query := `SELECT c.id,c.user_id,c.content,c.created_at,
	u.firstname,u.lastname, (SELECT count(*) FROM comment cm
	 WHERE cm.target_id = c.id) comments,(SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = 1) likes , (SELECT count(*) FROM likes l WHERE l.card_id = c.id and l.is_like = -1) dislikes
			FROM card c  JOIN comment cm ON c.id = cm.card_id JOIN user u ON c.user_id = u.id
			WHERE cm.target_id = ? 
			GROUP BY c.id ORDER BY c.id DESC;`
	data_Rows := database.SelectRows(query,target)
    for data_Rows.Next(){
        Row := comment_Row_View{}
        err := data_Rows.Scan(&Row.Id,&Row.User_Id,&Row.Content,&Row.CreatedAt,&Row.FirstName,&Row.LastName,&Row.Comments,&Row.Likes,&Row.DisLikes)
        if err != nil {
            return nil
        }    
        list_Comments = append(list_Comments, Row)
    }
	return list_Comments
}
