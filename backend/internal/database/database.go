package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

func InitDB() error {
	if _, err := os.Stat("../../app.db"); os.IsNotExist(err) {
		fmt.Println("Creating new database file...")
		db, err := sql.Open("sqlite3", "../../app.db")
		if err != nil {
			return fmt.Errorf("failed to open database: %v", err)
		}
		defer db.Close()

		sqlFile, err := os.ReadFile("../internal/database/database.sql")
		if err != nil {
			return fmt.Errorf("failed to read SQL file: %v", err)
		}
		_, err = db.Exec("PRAGMA foreign_keys = ON;")
		if err != nil {
			return fmt.Errorf("failed to enable foreign keys: %v", err)
		}

		_, err = db.Exec(string(sqlFile))
		if err != nil {
			return fmt.Errorf("failed to execute SQL: %v", err)
		}

	}
	return nil
}

func Config() *sql.DB {
	db, err := sql.Open("sqlite3", "../../app.db")
	if err != nil {
		log.Fatal("error opening database: ", err)
	}
	
	err = db.Ping()
	if err != nil {
		log.Fatal("error connecting to database:", err)
	}
	return db
}

func SelectOneRow(query string, model ...any) *sql.Row {
	db := Config()
	DataRow := db.QueryRow(query, model...)
	defer db.Close()
	return DataRow
}

func SelectRows(query string, model ...any) *sql.Rows {
	db := Config()
	rows, err := db.Query(query, model...)
	if err != nil {
		fmt.Printf("query error: %v\n", err)
		db.Close()
		return nil
	}
	defer db.Close()
	return rows
}

func Exec(query string, model ...any) (sql.Result, error) {
	db := Config()
	defer db.Close()
	res, err := db.Exec(query, model...)
	if err != nil {
		return nil, fmt.Errorf("exec error: %v", err)
	}
	return res, nil
}
