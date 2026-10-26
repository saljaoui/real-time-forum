package handlers

import (
	"net/http"
	"time"

	repository "forum-project/backend/internal/repository/users"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JsoneResponse(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	defer r.Body.Close()
	var user repository.User
	decode := DecodeJson(r)
	decode.DisallowUnknownFields()

	err := decode.Decode(&user)
	if err != nil {
		JsoneResponse(w, r, err.Error(), http.StatusBadRequest)
		return
	}

	timeex := time.Now().Add(5 * time.Hour).UTC()
	userRegiseter, message, uuid := user.Register(timeex)
	if message.MessageError != "" {
		JsoneResponse(w, r, message.MessageError, http.StatusBadRequest)
		return
	}

	SetCookie(w, r, "token", uuid, timeex)
	JsoneResponse(w, r, userRegiseter, http.StatusOK)
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JsoneResponse(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	defer r.Body.Close()
	var user repository.Login
	decode := DecodeJson(r)
	err := decode.Decode(&user)
	if err != nil {
		JsoneResponse(w, r, err.Error(), http.StatusBadRequest)
		return
	}
	timeex := time.Now().Add(5 * time.Hour).UTC()
	loged, message, uuid := user.Authentication(timeex)
	user.Getuuid(uuid.String())
	if message.MessageError != "" {
		JsoneResponse(w, r, message.MessageError, http.StatusBadRequest)
		return
	}

	userid := GetUserId(r)
	repository.UpdateStatusUser(userid, "online")
	SetCookie(w, r, "token", uuid.String(), timeex)
	JsoneResponse(w, r, loged, http.StatusOK)
}

func HandleLogOut(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JsoneResponse(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	defer r.Body.Close()
	var logout repository.Logout
	decode := DecodeJson(r)

	err := decode.Decode(&logout)
	if err != nil {
		JsoneResponse(w, r, "Invalid request format", http.StatusBadRequest)
		return
	}
	// The token cookie is HttpOnly, so the frontend cannot read it; fall back to the cookie.
	if logout.Uuid == "" {
		if cookie, err := r.Cookie("token"); err == nil {
			logout.Uuid = cookie.Value
		}
	}
	logout.Id = int64(GetUserId(r))
	var uuid repository.UUID

	message := uuid.UUiduser(logout.Uuid)
	if message.MessageError != "" {
		JsoneResponse(w, r, "Missing or invalid Uuid", http.StatusBadRequest)
		return
	}
	message = logout.LogOut()
	if message.MessageError != "" {
		JsoneResponse(w, r, message.MessageError, http.StatusBadRequest)
		return
	}

	repository.UpdateStatusUser(int(logout.Id), "offline")
	clearCookies(w, r)
	w.WriteHeader(http.StatusOK)
}

func SetCookie(w http.ResponseWriter, r *http.Request, name string, value string, time time.Time) {
	user := http.Cookie{
		Name:     name,
		Value:    value,
		Expires:  time,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		// Only mark Secure on https, otherwise local http dev would lose the cookie.
		Secure: r.TLS != nil || r.Header.Get("X-Forwarded-Proto") == "https",
	}
	http.SetCookie(w, &user)
}

func GetUserId(r *http.Request) int {
	cookie, err := r.Cookie("token")
	if err != nil {
		return 0
	}
	uuid := repository.UUID{}
	uuid.UUiduser(cookie.Value)

	return uuid.Iduser
}

func clearCookies(w http.ResponseWriter, r *http.Request) {
	SetCookie(w, r, "token", "", time.Now())
	SetCookie(w, r, "user_id", "", time.Now())
}
