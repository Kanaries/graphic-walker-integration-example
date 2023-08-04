## Demo Backend Service

The backend service provided in the example is just a demo implemented in Go. You can also implement your own service using the gw-dsl-parser([https://github.com/Kanaries/gw-dsl-parser](https://github.com/Kanaries/gw-dsl-parser)).

**Error handler will be ignored in the demo project, please do not use it directly in production environments.**

Your HTTP service just needs to expose the following API:

### Query API

Inside your API, you need to use the datasetId to retrieve the table name for your query. The table name along with the DSL is required for the SDK to help generate the SQL.

Path: you can configure it in GraphicWalker:

Method : POST

Request :

- datasetId: The parameters you pass when init GraphicWalker can be used as the unique identifier for the dataset.
- payload : GraphicWalkerDSL，you can directly pass GraphicWalkerDSL as a parameter to the SDK to parse it into SQL.

Response:

- success: true or false

- data: the API returns an array of maps, where each map contains string keys and values. can use a Protobuf to represent the return value:

    ```protobuf
    message Data {
      repeated MapFieldEntry maps = 1; 
    }
    
    message MapFieldEntry {
      string key = 1;
      google.protobuf.Value value = 2;
    }
    ```


for example:

```go
func Query(datasetId, dsl string) []map[string]interface{} {
		// get table name by datasetId
		tableName := getTableNameById(datasetId)
		
		// create Postgres Parser 
		baseParser := parser.NewDuckDBParser()
		
		dataset := parser.Dataset{
			Source: queryDataset.Name,
			Type:  parser.DatasetType(queryDataset.Type),
		}

		// convert dsl to sql
		sql, err := baseParser.Parse(dataset, dsl)
		
		// you can use sql push to query engine
		body := query(sql)
		
		return body
}
```

### Meta Query API

This interface will return the meta information needed by GraphicWalker. You need to convert the table schema in the database corresponding to the datasetid into the Dataset struct.

Path: you can configure it in GraphicWalker:

Method : GET

Request :

- datasetId: The parameters you pass when init GraphicWalker can be used as the unique identifier for the dataset.

Response

- success: false or true
- data
    - datasetId
    - name: table name use to display
    - fieldsMeta: table fields meta

the Protobuf like this :

```protobuf
message Dataset {
  int32 datasetId = 1; 
  string name = 2;
  repeated Meta fieldsMeta = 3;
}

message Meta {
  string fid = 1;  // the unique identifier of a column, in most cases it will be the same as the column name.
  string name = 2; // column name
  string semanticType = 3; // semantic types, they need to be converted from the database column types. We can provide a mapping table to handle this conversion.
}
```

semantic types mapping

```protobuf
var semanticTypeMap = map[string]string{
	"INT":        "quantitative",
	"FLOAT":      "quantitative",
	"TIME":       "temporal",
	"DATETIME":   "temporal",
	"TIMESTAMP":  "temporal",
	"CHAR":       "nominal",
	"VARCHAR":    "nominal",
	"STRING":     "nominal",
	"TEXT":       "nominal",
	"MEDIUMTEXT": "nominal",
	"LONGTEXT":   "nominal",
}
```

### Meta Update API


When a user makes modifications in GraphicWalker, it will send a request to this interface to modify the meta information you have recorded.

Path: you can configure it in GraphicWalker:

Method : POST

Request :

- datasetId
- fieldsMeta

Response

- success: bool or false
- data
    - fieldsMeta: table fields meta