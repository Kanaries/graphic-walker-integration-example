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
	DataType     string `json:"dataType"`
	SemanticType string `json:"semanticType"`
}

// QueryMeta
func (a *api) QueryMeta(datasetId string) ([]Meta, error) {
	// Prepare & Execute SQL statement
	stmt, err := a.DB.Prepare(fmt.Sprintf("SELECT * FROM (%s) as temp limit 1", datasetId))
	if err != nil {
		return nil, fmt.Errorf("unable to prepare statement: %v", err)
	}
	defer stmt.Close()
	rows, err := stmt.Query()
	if err != nil {
		return nil, fmt.Errorf("unable to execute query: %v", err)
	}
	defer rows.Close()

	// Iterate over the rows and append to the slice
	var metas []Meta
	for rows.Next() {
		names, err := rows.Columns()
		if err != nil {
			return nil, fmt.Errorf("unable to get columns: %v", err)
		}
		types, err := rows.ColumnTypes()
		if err != nil {
			return nil, fmt.Errorf("unable to get column types: %v", err)
		}
		for i, t := range types {
			fmt.Printf("%s %s\n", names[i], t.DatabaseTypeName())
			var meta Meta
			meta.Name = names[i]
			meta.Fid = names[i]
			meta.SemanticType = ConvertDataTypeToSemanticType(t.DatabaseTypeName())
			metas = append(metas, meta)
		}
	}

	return metas, nil
}

func ConvertDataTypeToSemanticType(dataType string) string {
	switch dataType {
	case "text":
		return "nominal"
	case "integer":
		return "quantitative"
	case "numeric":
		return "quantitative"
	case "boolean":
		return "nominal"
	case "date":
		return "temporal"
	case "timestamp":
		return "temporal"
	default:
		return "nominal"
	}
}

// UpdateMeta
func (a *api) UpdateMeta(datasetIdStr string, metas []Meta) error {
	datasetId, _ := strconv.Atoi(datasetIdStr)
	// Prepare SQL statement
	stmt, err := a.DB.Prepare("UPDATE meta SET Name = ?, SemanticType = ? WHERE Fid = ? AND DatasetID = ?")
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
	err := a.DB.QueryRow("SELECT DatasetId, Name FROM dataset WHERE DatasetId = ?", datasetId).Scan(&dataset.DatasetId, &dataset.Name)
	if err != nil {
		return Dataset{}, fmt.Errorf("unable to execute query on datasets table: %v", err)
	}

	// Query the Metas associated with the Dataset
	rows, err := a.DB.Query("SELECT Fid, Name, SemanticType FROM meta WHERE DatasetID = ?", datasetId)
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
	rows, err := a.DB.Query(sql)
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
