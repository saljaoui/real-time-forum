package handlers

import (
	"encoding/json"
	"net/http"

	category "forum-project/backend/internal/repository/categories"

)

func HandelCategory(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	categoryStruct := category.Category{}
	decode := DecodeJson(r)
	err := decode.Decode(&categoryStruct)
	if err != nil {
		JsoneResponse(w,r, err.Error(), http.StatusBadRequest)
		return
	}
	posts := category.GetPostsByCategoryId(categoryStruct.Category)
	json.NewEncoder(w).Encode(posts)
}
