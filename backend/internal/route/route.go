package route

import (
	"net/http"
	"os"
	"strings"

	"forum-project/backend/internal/handlers"
)

func SetupAPIRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/register", handlers.HandleRegister)
	mux.HandleFunc("/api/category", handlers.HandelCategory)
	mux.HandleFunc("/api/login", handlers.HandleLogin)
	mux.HandleFunc("/api/comment", handlers.Handel_GetCommet)
	mux.HandleFunc("/api/card", handlers.GetCard_handler)
	mux.HandleFunc("/api/isLogged", handlers.HandleIsLogged)
	mux.HandleFunc("/api/userId", handlers.HandleUserId)

	mux.Handle("/ws", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.NewWS().HandleWebSocket)))
	mux.Handle("/api/users/status", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandleUsersStatus)))
	mux.Handle("/api/messages/history", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.GetMessageHistory)))

	mux.HandleFunc("/api/auth", handlers.HandelStatus)
	mux.Handle("/api/reaction", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandleReaction)))
	mux.Handle("/api/getUserReaction", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandlegetUserReaction)))
	mux.Handle("/api/home", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HomeHandle)))
	mux.Handle("/api/profile/posts", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandleProfilePosts)))
	mux.Handle("/api/profile/likes", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandleProfileLikes)))
	mux.Handle("/api/post", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandlePost)))
	mux.Handle("/api/addcomment", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.Handler_AddComment)))
	mux.Handle("/api/logout", handlers.AuthenticateMiddleware(http.HandlerFunc(handlers.HandleLogOut)))
}

func SetupPageRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			handlers.JsoneResponseError(w, r, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		suffix := r.URL.Path[len("/static/"):]

		if strings.Contains(suffix, ".css/") || strings.Contains(suffix, ".js/") || strings.Contains(suffix, ".png/") {
			handlers.JsoneResponseError(w, r, "Not Found", http.StatusNotFound)
			return
		}

		if strings.Contains(suffix, ".js") {
			http.ServeFile(w, r, "../../frontend/static/"+suffix)
			return
		}

		allowedFiles := map[string]bool{
			"css/style.css":          true,
			"imgs/background.png":    true,
			"imgs/s.png":             true,
			"imgs/avatar.png":        true,
			"imgs/backgtoundWeb.png": true,
			"imgs/notif.png":         true,
		}

		if !allowedFiles[suffix] {
			handlers.JsoneResponseError(w, r, "Access Forbidden", http.StatusForbidden)
			return
		}
		http.ServeFile(w, r, "../../frontend/static/"+suffix)
	})

	mux.HandleFunc("/space", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../../frontend/templates/index.html")
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		validatePath(w, r)
	})

	mux.HandleFunc("/err", func(w http.ResponseWriter, r *http.Request) {
		filePath := "../../frontend/templates/index.html"
		fileContent, err := os.ReadFile(filePath)
		if err != nil {
			handlers.JsoneResponse(w, r, "Error loading the error page", http.StatusInternalServerError)
			return
		}
		w.Write(fileContent)
	})
}

func isValidPath(path string, paths []string) bool {
	for _, v := range paths {
		if path == v {
			return true
		}
	}
	return false
}

func validatePath(w http.ResponseWriter, r *http.Request) {
	paths := []string{
		"/space",
	}
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/space", http.StatusFound)
		return
	} else if !isValidPath(r.URL.Path, paths) {
		handlers.JsoneResponseError(w, r, "Page Not Found", http.StatusNotFound)
		return
	}
}
