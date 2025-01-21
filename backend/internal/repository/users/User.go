package user

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	messages "forum-project/backend/internal/Messages"
	"forum-project/backend/internal/database"

	"github.com/gofrs/uuid/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserStatusResponse struct {
	ID        int       `json:"id"`
	Nickname  string    `json:"nickname"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Status    string    `json:"status"`
	LastSeen  time.Time `json:"lastSeen,omitempty"`
	Email     string    `json:"email"`
	Notif     string    `json:"notif"`
}

type Status struct {
	Type        string               `json:"type"` // "message", "status", "typing", etc.
	UsersStatus []UserStatusResponse `json:"usersStatus"`
}

type User struct {
	Id        int64     `json:"id"`
	Nickname  string    `json:"nickName"`
	Age       string    `json:"age"`
	Gender    string    `json:"gender"`
	Firstname string    `json:"firstname"`
	Lastname  string    `json:"lastname"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"createdat"`
	UUID      uuid.UUID `json:"uuid"`
	Status    uuid.UUID `json:"status"`
}
type ResponceUser struct {
	Id        int64  `json:"id"`
	Nickname  string `json:"nickName"`
	Age       string `json:"age"`
	Gender    string `json:"gender"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Email     string `json:"email"`
	UUID      string `json:"uuid"`
}
type Login struct {
	Id       int64  `json:"id"`
	Email    string `json:"email"`
	UUID     string `json:"uuid"`
	Password string `json:"password"`
}

type UUID struct {
	Iduser int
}
type Logout struct {
	Id   int64  `json:"id"`
	Uuid string `json:"uuid"`
}

func generatUUID() string {
	uuid, err := uuid.NewV4()
	if err != nil {
		fmt.Println("Error to Generate uuid", err)
	}
	return uuid.String()
}

func (users *User) Register(timeex time.Time) (ResponceUser, messages.Messages, string) {
	message := messages.Messages{}
	uuid := generatUUID()
	loged := ResponceUser{
		Id:        users.Id,
		UUID:      uuid,
		Email:     users.Email,
		Firstname: users.Firstname,
		Lastname:  users.Lastname,
		Nickname:  users.Nickname,
		Age:       users.Age,
		Gender:    users.Gender,
	}

	if strings.Trim(users.Firstname, " ") == "" || strings.Trim(users.Email, " ") == "" ||
		strings.Trim(users.Lastname, " ") == "" || strings.Trim(users.Password, " ") == "" {
		message.MessageError = "All Input is Required"
		return ResponceUser{}, message, ""
	}

	// message = users.validateUser()
	// if message.MessageError != "" {
	// 	return ResponceUser{}, message, ""
	// }

	checkemail := strings.ToLower(users.Email)
	exists := emailExists(checkemail)
	if exists {
		message.MessageError = "Email user already exists"
		return ResponceUser{}, message, ""
	}

	password := hashPassword(users.Password)
	rows, err := insertUser(users, password)
	if err != nil {
		message.MessageError = "Error creating this user."
		return loged, message, uuid
	}

	user_id, err := rows.LastInsertId()
	if err != nil {
		message.MessageError = err.Error()
		return ResponceUser{}, message, ""
	} else {
		err = updateUUIDUser(uuid, user_id, timeex)
		if err != nil {
			fmt.Println("Error to Update")
		}
		message.MessageSucc = "User Created Successfully."
	}
	loged.Id = user_id
	return loged, message, uuid
}

// func (users *User) validateUser() messages.Messages {
// 	message := messages.Messages{}

// 	nameRegex := regexp.MustCompile(`^[A-Za-z]{2,}$`)
//     if !nameRegex.MatchString(strings.TrimSpace(users.Firstname)) {
//         message.MessageError = "Invalid First name"
//         return message
//     }

//     if !nameRegex.MatchString(strings.TrimSpace(users.Lastname)) {
//         message.MessageError = "Invalid Last name"
//         return message
//     }

// 	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
// 	if !emailRegex.MatchString(strings.ToLower(users.Email)) {
// 		message.MessageError = "Invalid email format"
// 		return message
// 	}

// 	if len(users.Password) < 8 {
// 		message.MessageError = "Invalis password length less than 8"
// 		return message
// 	}

// 	return message
// }

func (log *Login) Authentication(time time.Time) (ResponceUser, messages.Messages, uuid.UUID) {
	message := messages.Messages{}
	email := strings.ToLower(log.Email)
	if log.Email == "" || !emailExists(email) {
		message.MessageError = "Invalid email"
		return ResponceUser{}, message, uuid.UUID{}
	} else {
		user := selectUser(log)
		if checkPasswordHash(user.Password, log.Password) {
			uuid, err := uuid.NewV4()
			if err != nil {
				fmt.Println("Error to Generate uuid", err)
			}
			loged := ResponceUser{
				Id:        user.Id,
				UUID:      uuid.String(),
				Email:     user.Email,
				Firstname: user.Firstname,
				Lastname:  user.Lastname,
			}
			err = updateUUIDUser(uuid.String(), user.Id, time)
			if err != nil {
				fmt.Println("Error to Update in Auth")
			}
			return loged, messages.Messages{}, uuid
		} else {
			message.MessageError = "Email or password incorrect."
			return ResponceUser{}, message, uuid.UUID{}
		}
	}
}

func (log *Login) Getuuid(uuid string) {
	log.UUID = uuid
}

func (Log *Logout) LogOut() (m messages.Messages) {
	timeex := time.Now().Add(0 * time.Second)
	err := updateUUIDUser("null", Log.Id, timeex)
	if err != nil {
		m.MessageError = "Error To Update user"
		return m
	} else {
		m.MessageSucc = "Update Seccesfly"
		return m
	}
}

func checkPasswordHash(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func hashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("error", err)
	}
	return string(hashedPassword)
}

func (us *User) AuthenticatLogin(UUID string) (m messages.Messages, expire time.Time) {
	exists, expire := CheckAuthenticat(UUID)
	if !exists {
		m.MessageError = "Unauthorized token"
	}

	return m, expire
}

func (u *UUID) UUiduser(uuid string) (m messages.Messages) {
	id, err := getUserIdWithUUID(uuid)
	if err != nil {
		m.MessageError = "Unauthorized token"
		return m
	}
	id_user, err := strconv.Atoi(id)
	if err != nil {
		m.MessageError = "Unauthorized token"
		return m
	}
	u.Iduser = id_user
	return m
}

func GetUsersStatus(userId int) []UserStatusResponse {
	db := database.Config()

	query := `
WITH last_messages AS (
            SELECT
                u.id AS user_id,
                u.firstname,
                u.lastname,
                u.nickname,
                u.email,
                u.age,
                u.gender,
				u.status,
				u.notif,
                u.CreateAt as user_created_at,
                COALESCE(m.message, "") as last_message_content,
                COALESCE(m.sender_id, 0) as last_message_sender,
                COALESCE(strftime('%Y-%m-%dT%H:%M:%SZ', m.sent_at), "") AS sort_time
            FROM
                user u
            LEFT JOIN messages m
                ON m.id = (
                    SELECT id
                    FROM messages
                    WHERE ((sender_id = u.id AND receiver_id = ? ) OR (sender_id = ? AND receiver_id = u.id))
                    ORDER BY sent_at DESC
                    LIMIT 1
                )
            WHERE
                u.id != ?
        )
        SELECT
            user_id AS id,
            nickname,
            firstname,
            lastname,
            email,
            status,
			notif
        FROM
            last_messages
        ORDER BY
            CASE
                WHEN sort_time = "" THEN 1 
                ELSE 0
            END,
            sort_time DESC,
            nickname ASC; `

	rows, err := db.Query(query, userId, userId, userId)
	if err != nil {
		log.Printf("Query error: %v", err)
		return nil
	}
	defer rows.Close()

	var users []UserStatusResponse
	for rows.Next() {
		var user UserStatusResponse

		err := rows.Scan(
			&user.ID,
			&user.Nickname,
			&user.FirstName,
			&user.LastName,
			&user.Email,
			&user.Status,
			&user.Notif,
		)
		if err != nil {
			log.Printf("Row scan error: %v", err)
			continue
		}

		users = append(users, user)
	}
	return users
}
