package net.kanaries.example.gwdemo;

import net.kanaries.dsl.ParserClient;
import net.kanaries.dsl.model.ParserResponse;
import net.kanaries.example.gwdemo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.*;

@SpringBootApplication
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class GwDemoApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${kanaries.key}")
    private String kanariesKey;

    public static void main(String[] args) {
        SpringApplication.run(GwDemoApplication.class, args);
    }


    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }



    // get dataset meta by id
    @GetMapping("/meta/query")
    public Response metaQuery(@RequestParam String datasetId) {
        List<Field> fields = getDatasetFields(datasetId);
        return new Response(true, new Dataset(datasetId, datasetId, fields));
    }


    private List<Field> getDatasetFields(String tableName) {
        List<Field> fields = new ArrayList<>();
        try {
            DatabaseMetaData dbmd = jdbcTemplate.getDataSource().getConnection().getMetaData();
            ResultSet columns = dbmd.getColumns(null, null, tableName, null);
            while (columns.next()) {
                String columnName = columns.getString("COLUMN_NAME");
                String typeName = columns.getString("TYPE_NAME");
                fields.add(new Field(columnName, columnName, typeName, SemanticTypeMapper.mapDataType(typeName)));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fields;
    }

    @PostMapping("/dsl/query")
    public Response dslQuery(@RequestBody Query query) {
        //get dataset meta
        List<Field> fields = getDatasetFields(query.getDatasetId());

        //new dsl meta
        net.kanaries.dsl.model.Dataset.Builder builder = new  net.kanaries.dsl.model.Dataset.Builder()
                .name(query.getDatasetId());
        for (Field field : fields) {
            builder.addField(field.getName(), MySQLTypeMapper.mapMySQLType(field.getType()));
        }
        net.kanaries.dsl.model.Dataset dataset = builder.build();

        // use client parser dsl to sql
        ParserClient client = new ParserClient(kanariesKey);
        ParserResponse parserResponse = client.parseDslToSql(dataset, query.getPayload(), "mysql");
        System.out.println(parserResponse.getSql());
        String sql = parserResponse.getSql();

        // use sql to query data
        List<Map<String, Object>> res = jdbcTemplate.queryForList(sql);
        return new Response(true, res);
    }
}
