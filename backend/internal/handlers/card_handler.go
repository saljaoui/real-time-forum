package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"forum-project/backend/internal/repository/cards"
)

func GetCard_handler(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	if req.URL.Path != "/api/card" {
		JsoneResponse(res, req, "Path not found", http.StatusNotFound)
		return
	}
	if req.Method != http.MethodGet {
		JsoneResponse(res, req, "Status Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	id, err := strconv.Atoi(req.FormValue("id"))
	if err != nil {
		JsoneResponse(res, req, "Status Bad Request ID Uncorect", http.StatusBadRequest)
		return
	}
	card := cards.GetOneCard(id)
	if card.Id == 0 {
		JsoneResponse(res, req, "Status Bad Request Not Have any card ", http.StatusBadRequest)
		return
	}
	json.NewEncoder(res).Encode(card)
}
