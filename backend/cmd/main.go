package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	port := os.Getenv("PORT")
	if port == "" {
		port = "3333"
	}
	serverAddr := ":" + port
	log.Printf("Server running at http://localhost%s/space\n", serverAddr)
	err := http.ListenAndServe(serverAddr, mux)
	if err != nil {
		log.Fatal("ListenAndServe Error: ", err)
	}
}
