package main

import (
	"database/sql"
	"fmt"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	_ "github.com/lib/pq"
	"os"
)

func (a *api) InitDB() error {
	// Open database

	db, err := sql.Open("postgres", getPGConnectionUrl())
	if err != nil {
		return fmt.Errorf("error opening database: %v", err)
	}
	a.DB = db
	return err
}

func getPGConnectionUrl() string {
	url := fmt.Sprintf("postgresql://%s:%s@%s:%v/%s?search_path=%s&sslmode=%s&connect_timeout=5",
		os.Getenv("CUBE_USER"),
		os.Getenv("CUBE_PASSWORD"),
		os.Getenv("CUBE_HOST"),
		os.Getenv("CUBE_PORT"),
		os.Getenv("CUBE_DB"),
		"",
		"disable")

	hlog.Info(url)
	return url
}
