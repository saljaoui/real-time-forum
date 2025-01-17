package handlers

import (
	"encoding/json"
	"net/http"
)

func HandelStatus(w http.ResponseWriter, r *http.Request) {
	cookies, err := r.Cookie("token")
	if err != nil || cookies == nil {
		json.NewEncoder(w).Encode(false)
	} else {
		json.NewEncoder(w).Encode(true)
	}
}
