package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/mattn/go-sqlite3"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// db is the single connection pool shared by the whole application.
var db *sql.DB

// AppRoot returns the project root directory. It defaults to "../.." so that
// `go run .` from backend/cmd keeps working; the Docker image sets APP_ROOT=/app.
func AppRoot() string {
	if root := os.Getenv("APP_ROOT"); root != "" {
		return root
	}
	return filepath.Join("..", "..")
}

// Path resolves a path relative to the project root.
func Path(rel string) string {
	return filepath.Join(AppRoot(), rel)
}

func InitDB() error {
	var err error
	if url := os.Getenv("TURSO_DATABASE_URL"); url != "" {
		log.Println("Using Turso (libSQL) database")
		db, err = sql.Open("libsql", url+"?authToken="+os.Getenv("TURSO_AUTH_TOKEN"))
	} else {
		dbFile := Path("app.db")
		log.Printf("Using local SQLite database %s\n", dbFile)
		db, err = sql.Open("sqlite3", "file:"+dbFile+"?_foreign_keys=on&_busy_timeout=5000")
	}
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}
	if err = db.Ping(); err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	if os.Getenv("TURSO_DATABASE_URL") != "" {
		if _, err := db.Exec("PRAGMA foreign_keys = ON;"); err != nil {
			log.Printf("warning: could not enable foreign keys: %v\n", err)
		}
	}

	return createSchema()
}

// createSchema runs database.sql, which only uses CREATE TABLE IF NOT EXISTS and
// seeds categories only when the table is empty, so it is safe on every startup.
func createSchema() error {
	sqlFile, err := os.ReadFile(Path("backend/internal/database/database.sql"))
	if err != nil {
		return fmt.Errorf("failed to read SQL file: %v", err)
	}

	for _, stmt := range strings.Split(string(sqlFile), ";") {
		if isEmptyStatement(stmt) {
			continue
		}
		if _, err := db.Exec(stmt); err != nil {
			return fmt.Errorf("failed to execute SQL: %v\n%s", err, stmt)
		}
	}
	return nil
}

// isEmptyStatement reports whether stmt contains only whitespace and -- comments.
func isEmptyStatement(stmt string) bool {
	for _, line := range strings.Split(stmt, "\n") {
		line = strings.TrimSpace(line)
		if line != "" && !strings.HasPrefix(line, "--") {
			return false
		}
	}
	return true
}

func Config() *sql.DB {
	if db == nil {
		log.Fatal("database not initialized: call InitDB first")
	}
	return db
}

func SelectOneRow(query string, model ...any) *sql.Row {
	return Config().QueryRow(query, model...)
}

func SelectRows(query string, model ...any) *sql.Rows {
	rows, err := Config().Query(query, model...)
	if err != nil {
		fmt.Printf("query error: %v\n", err)
		return nil
	}
	return rows
}

func Exec(query string, model ...any) (sql.Result, error) {
	res, err := Config().Exec(query, model...)
	if err != nil {
		return nil, fmt.Errorf("%v", err)
	}
	return res, nil
}
