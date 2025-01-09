package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	comment "forum-project/backend/internal/repository/comments"
)

func Handel_GetCommet(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	if req.Method != http.MethodGet {
		JsoneResponse(res, req, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	id, err := strconv.Atoi(req.FormValue("target_id"))
	if err != nil {
		JsoneResponse(res, req, "Status Bad Request", http.StatusBadRequest)
		return
	}
	comments := comment.GetAllCommentsbyTarget(id)
	if len(comments) == 0 {
		return
	}
	if comments == nil {
		JsoneResponse(res, req, "Status Not Found", http.StatusNotFound)
		return
	}
	json.NewEncoder(res).Encode(comments)
}

func Handler_AddComment(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	if req.Method != http.MethodPost {
		JsoneResponse(res, req, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	statusCode := addComment(req)
	if statusCode == http.StatusBadRequest {
		JsoneResponse(res, req, "comment Infos are wrongs!! ", http.StatusBadRequest)
		return
	}
	if statusCode == http.StatusOK {
		JsoneResponse(res, req, "comment added succesfuly", http.StatusCreated)
		return
	}
}

func addComment(req *http.Request) int {
	iduser := GetUserId(req)
	comment := comment.Comment{}
	comment.User_Id = iduser
	if comment.User_Id == 0 {
		fmt.Println("error")
		return -1
	}

	decoder := DecodeJson(req)
	err := decoder.Decode(&comment)
	if err != nil || (comment.Content == "") {
		return http.StatusBadRequest
	}
	if comment.Content == "" || len(comment.Content) > 1000 {
		return http.StatusBadRequest
	}
	comment.Add()
	return http.StatusOK
}
