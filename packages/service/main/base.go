package main

import (
	"fmt"
	"strconv"
)

type Dataset struct {
	DatasetId int    `json:"datasetId"`
	Name      string `json:"name"`
	Meta      []Meta `json:"meta"`
}

type Meta struct {
	Fid          string `json:"fid"`
	Name         string `json:"name"`
	SemanticType string `json:"semanticType"`
}

// QueryMeta
func (a *api) QueryMeta(datasetIdStr string) ([]Meta, error) {
	datasetId, _ := strconv.Atoi(datasetIdStr)
	// Prepare & Execute SQL statement
	stmt, _ := a.db.Prepare("SELECT Fid, Name, SemanticType FROM meta WHERE DatasetID = ?")
	defer stmt.Close()
	rows, _ := stmt.Query(datasetId)
	defer rows.Close()

	// Iterate over the rows and append to the slice
	var metas []Meta
	for rows.Next() {
		var meta Meta
		_ = rows.Scan(&meta.Fid, &meta.Name, &meta.SemanticType)
		metas = append(metas, meta)
	}

	return metas, nil
}

// UpdateMeta
func (a *api) UpdateMeta(datasetIdStr string, metas []Meta) error {
	datasetId, _ := strconv.Atoi(datasetIdStr)
	// Prepare SQL statement
	stmt, err := a.db.Prepare("UPDATE meta SET Name = ?, SemanticType = ? WHERE Fid = ? AND DatasetID = ?")
	if err != nil {
		return fmt.Errorf("unable to prepare statement: %v", err)
	}
	defer stmt.Close()

	for _, meta := range metas {
		// Execute SQL statement
		result, err := stmt.Exec(meta.Name, meta.SemanticType, meta.Fid, datasetId)
		if err != nil {
			return fmt.Errorf("unable to execute update: %v", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("unable to get affected rows: %v", err)
		}

		fmt.Printf("Number of rows updated for Fid %s: %d\n", meta.Fid, rowsAffected)
	}

	return nil
}

// QueryDataset
func (a *api) QueryDataset(datasetIdStr string) (Dataset, error) {
	datasetId, _ := strconv.Atoi(datasetIdStr)
	// Query the Dataset
	var dataset Dataset
	err := a.db.QueryRow("SELECT DatasetId, Name FROM dataset WHERE DatasetId = ?", datasetId).Scan(&dataset.DatasetId, &dataset.Name)
	if err != nil {
		return Dataset{}, fmt.Errorf("unable to execute query on datasets table: %v", err)
	}

	// Query the Metas associated with the Dataset
	rows, err := a.db.Query("SELECT Fid, Name, SemanticType FROM meta WHERE DatasetID = ?", datasetId)
	if err != nil {
		return Dataset{}, fmt.Errorf("unable to execute query on meta table: %v", err)
	}
	defer rows.Close()

	// Iterate over the rows and append to the Meta slice
	for rows.Next() {
		var meta Meta
		err = rows.Scan(&meta.Fid, &meta.Name, &meta.SemanticType)
		if err != nil {
			return Dataset{}, fmt.Errorf("unable to scan row: %v", err)
		}
		dataset.Meta = append(dataset.Meta, meta)
	}

	// Check for errors from iterating over rows
	if err = rows.Err(); err != nil {
		return Dataset{}, fmt.Errorf("error iterating rows: %v", err)
	}

	return dataset, nil
}

// QueryDatasource
func (a *api) QueryDatasource(sql string) ([]map[string]interface{}, error) {
	rows, err := a.db.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	// Make a slice for the values
	values := make([]interface{}, len(columns))

	// rows.Scan wants '[]interface{}' as an argument, so we must take the address of each value in values
	valuePtrs := make([]interface{}, len(columns))
	for i := 0; i < len(columns); i++ {
		valuePtrs[i] = &values[i]
	}

	var result []map[string]interface{}
	for rows.Next() {
		err = rows.Scan(valuePtrs...)
		if err != nil {
			return nil, err
		}

		rowResult := make(map[string]interface{})
		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if ok {
				v = string(b)
			} else {
				v = val
			}
			rowResult[col] = v
		}

		result = append(result, rowResult)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}
