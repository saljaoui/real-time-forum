package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
)

func DecodeJson(r *http.Request) *json.Decoder {
	decode := json.NewDecoder(r.Body)
	decode.DisallowUnknownFields()
	return decode
}

func JsoneResponse(w http.ResponseWriter, r *http.Request, message any, code int) {
	w.WriteHeader(code)
	err := json.NewEncoder(w).Encode(map[string]any{
		"message": message,
	})
	if err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
		return
	}
}

type ErrorPageData struct {
	Code    int
	Message any
}

func JsoneResponseError(w http.ResponseWriter, r *http.Request, message any, code int) {
	tmpl, err := template.ParseFiles("../../frontend/templates/error.html")
	if err != nil {
		fmt.Println(err)
	}

	w.WriteHeader(code)

	err = tmpl.Execute(w, ErrorPageData{
		Code:    code,
		Message: message,
	})
	if err != nil {
		http.Error(w, "Failed to render template", http.StatusInternalServerError)
	}
}

func NewEncoderJsone(w http.ResponseWriter) *json.Encoder {
	decode := json.NewEncoder(w)
	return decode
}
