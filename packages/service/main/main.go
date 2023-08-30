package main

import (
	"database/sql"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/kanaries/gw-dsl-parser/parser"
	_ "github.com/mattn/go-sqlite3"
	"io/ioutil"
	"log"
	"net/http"
)

type api struct {
	DB *sql.DB
}

type SuccessResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
}

func main() {
	// Create api and init database with filling example data
	app := &api{}

	if err := app.InitDB(); err != nil {
		log.Fatalf("%v", err)
	}

	// Create router and listen
	router := mux.NewRouter()

	router.Handle("/meta/query", corsMiddleware(http.HandlerFunc(app.QueryMetaHandler))).Methods("GET", http.MethodOptions)
	router.Handle("/meta/update", corsMiddleware(http.HandlerFunc(app.UpdateMetaHandler))).Methods("POST", http.MethodOptions)
	router.Handle("/dsl/query", corsMiddleware(http.HandlerFunc(app.QueryDatesetHandler))).Methods("POST", http.MethodOptions)

	http.ListenAndServe(":23402", router)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (a *api) QueryMetaHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("datasetId")

	//Query CubeJS Meta
	meta, err := a.QueryMeta(id)
	if err != nil {
		println(err)
		return
	}

	resp := SuccessResponse{Success: true, Data: map[string]interface{}{
		"fieldsMeta": meta,
		"name":       id,
		"datasetId":  id,
	}}
	_ = json.NewEncoder(w).Encode(resp)
}

func (a *api) UpdateMetaHandler(w http.ResponseWriter, r *http.Request) {
	type updateRequest struct {
		DatasetID string `json:"datasetId"`
		Meta      []Meta `json:"fieldsMeta"`
	}
	var ur updateRequest
	strBody, _ := ioutil.ReadAll(r.Body)
	_ = json.Unmarshal(strBody, &ur)

	resp := SuccessResponse{Success: true, Data: map[string]interface{}{
		"fieldsMeta": ur.Meta,
	}}
	json.NewEncoder(w).Encode(resp)
}

func (a *api) QueryDatesetHandler(w http.ResponseWriter, r *http.Request) {
	// parser request
	type queryRequest struct {
		DatasetID string                  `json:"datasetId"`
		Payload   parser.GraphicWalkerDSL `json:"payload"`
	}
	var ur queryRequest
	strBody, _ := ioutil.ReadAll(r.Body)
	_ = json.Unmarshal(strBody, &ur)

	// parser sql
	baseParser := parser.BaseParser{}
	dataset := parser.Dataset{
		Source: ur.DatasetID,
		Type:   "table",
	}
	sql, _ := baseParser.Parse(dataset, ur.Payload)
	log.Printf(sql)
	// user sql to query datasource
	res, err := a.QueryDatasource(sql)
	if err != nil {
		println(err)
		return
	}

	// return result
	resp := SuccessResponse{Success: true, Data: res}
	json.NewEncoder(w).Encode(resp)
}
