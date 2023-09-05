package main

import (
	"database/sql"
	"fmt"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"os"
)

func (a *api) InitDB() error {
	// Open database

	db, err := getMysqlDB()
	if err != nil {
		return fmt.Errorf("error opening database: %v", err)
	}
	a.DB = db
	return err
}

func getDB() (*sql.DB, error) {
	if os.Getenv("DB_TYPE") == "MYSQL" {
		return getMysqlDB()
	} else if os.Getenv("DB_TYPE") == "CUBE" {
		return getCubeDB()
	}
	return nil, fmt.Errorf("invalid db type")
}

func getMysqlDB() (*sql.DB, error) {
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_HOST"),
		os.Getenv("MYSQL_PORT"),
		os.Getenv("MYSQL_DB"))
	hlog.Info(url)
	db, err := sql.Open("mysql", url)
	return db, err
}

func getCubeDB() (*sql.DB, error) {
	url := fmt.Sprintf("postgresql://%s:%s@%s:%v/%s?search_path=%s&sslmode=%s&connect_timeout=5",
		os.Getenv("CUBE_USER"),
		os.Getenv("CUBE_PASSWORD"),
		os.Getenv("CUBE_HOST"),
		os.Getenv("CUBE_PORT"),
		os.Getenv("CUBE_DB"),
		"",
		"disable")
	hlog.Info(url)
	db, err := sql.Open("postgres", url)
	return db, err
}
