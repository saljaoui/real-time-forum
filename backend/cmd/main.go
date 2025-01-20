package main

import (
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"

	"forum-project/backend/internal/database"
	route "forum-project/backend/internal/route"
)

func main() {
	Err := database.InitDB()
	if Err != nil {
		log.Fatal(fmt.Errorf("failed to initialize database: %w", Err))
	}

	mux := http.NewServeMux()

	route.SetupAPIRoutes(mux)
	route.SetupPageRoutes(mux)

	serverAddr := ":3333"
	log.Printf("Server running at http://10.1.6.12%s/diprela\n", serverAddr)
	err := http.ListenAndServe(serverAddr, mux)
	if err != nil {
		log.Fatal("ListenAndServe Error: ", err)
	}
}
