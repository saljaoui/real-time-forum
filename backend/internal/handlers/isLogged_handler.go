package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	user "forum-project/backend/internal/repository/users"
)

func HandleIsLogged(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	if r.Method != http.MethodGet {
		JsoneResponse(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	cookies, err := r.Cookie("token")
	if err != nil {
		fmt.Println(err)
	}
	is, expire := user.CheckAuthenticat(cookies.Value)
	if !time.Now().Before(expire) {
 		logout := user.Logout{}
		u := user.UUID{}
		u.UUiduser(cookies.Value)
 		logout.Id = int64(u.Iduser)
		logout.Uuid = cookies.Value
 		logout.LogOut()
 	}
	json.NewEncoder(w).Encode(is)
}
