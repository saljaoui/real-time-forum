package user

import (
	"database/sql"
	"fmt"
	"html"
	"strings"
	"time"

	"forum-project/backend/internal/database"
)

func emailExists(email string) bool {
	var exists bool
	query := "SELECT EXISTS (select email from user where email=?)"
	err := database.SelectOneRow(query, email).Scan(&exists)
	if err != nil {
		fmt.Println("Error to EXISTS this Email", err)
	}
	return exists
}

func updateUUIDUser(uudi string, userId int64, expires time.Time) error {
	stm := "UPDATE user SET UUID=?, expires =?  WHERE id=?"
	_, err := database.Exec(stm, uudi, expires, userId)
	return err
}

func insertUser(users *User, password string) (sql.Result, error) {
	Firstname := html.EscapeString(users.Firstname)
	Lastname := html.EscapeString(users.Lastname)
	Email := strings.ToLower(html.EscapeString(users.Email))
	Password := html.EscapeString(password)
	stm := "INSERT INTO user (firstname,lastname,email,password) VALUES(?,?,?,?)"
	row, err := database.Exec(stm, Firstname, Lastname, Email, Password)
	return row, err
}

func selectUser(log *Login) *User {
	user := User{}
	email := strings.ToLower(log.Email)
	password := strings.ToLower(log.Password)
	query := "select id,email,password, firstname ,lastname FROM user where email=?"
	err := database.SelectOneRow(query, email, password).Scan(&user.Id, &user.Email, &user.Password, &user.Firstname, &user.Lastname)
	if err != nil {
		fmt.Println("error to select user", err)
	}
	return &user
}

func CheckAuthenticat(uuid string) (bool, time.Time) {
	stm := `SELECT 
			EXISTS (SELECT 1 FROM user WHERE UUID = ?),
			(SELECT expires FROM user WHERE UUID = ? ) AS expires; `
	var exists bool
	var expires sql.NullTime

	err := database.SelectOneRow(stm, uuid, uuid).Scan(&exists, &expires)
	if err != nil {
		fmt.Println(err, "here")
	}
	if !expires.Valid {
		return exists, time.Time{}
	}
	if !time.Now().Before(expires.Time) {
		return false, time.Time{}
	}
	return exists, expires.Time
}

func CheckUser(id int) bool {
	stm := `SELECT EXISTS (SELECT 1 FROM user WHERE id =  ?)  `
	var exists bool
	err := database.SelectOneRow(stm, id, id).Scan(&exists)
	if err != nil {
		fmt.Println(err)
	}
	return exists
}

func getUserIdWithUUID(uuid string) (string, error) {
	stm := `SELECT id FROM user WHERE UUID=? `
	var uuiduser string
	err := database.SelectOneRow(stm, uuid).Scan(&uuiduser)
	if err != nil {
		return "", err
	}
	return uuiduser, nil
}
