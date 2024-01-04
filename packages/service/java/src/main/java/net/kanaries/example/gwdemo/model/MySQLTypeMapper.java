package net.kanaries.example.gwdemo.model;

import net.kanaries.dsl.model.DataType;

import java.util.HashMap;
import java.util.Map;

public class MySQLTypeMapper {
    private static final Map<String, DataType> typeMap;
    static {
        typeMap = new HashMap<>();

        typeMap.put("CHAR", DataType.STRING);
        typeMap.put("VARCHAR", DataType.STRING);
        typeMap.put("TINYTEXT", DataType.STRING);
        typeMap.put("TEXT", DataType.STRING);
        typeMap.put("MEDIUMTEXT", DataType.STRING);
        typeMap.put("LONGTEXT", DataType.STRING);

        typeMap.put("TINYINT", DataType.NUMBER);
        typeMap.put("SMALLINT", DataType.NUMBER);
        typeMap.put("MEDIUMINT", DataType.NUMBER);
        typeMap.put("INT", DataType.NUMBER);
        typeMap.put("BIGINT", DataType.NUMBER);
        typeMap.put("FLOAT", DataType.NUMBER);
        typeMap.put("DOUBLE", DataType.NUMBER);
        typeMap.put("DECIMAL", DataType.NUMBER);

        typeMap.put("DATE", DataType.DATETIME);
        typeMap.put("DATETIME", DataType.DATETIME);
        typeMap.put("TIMESTAMP", DataType.DATETIME);

        typeMap.put("BIT", DataType.BOOLEAN);
        typeMap.put("BOOL", DataType.BOOLEAN);
        typeMap.put("BOOLEAN", DataType.BOOLEAN);
    }

    public static DataType mapMySQLType(String mysqlType) {
        return typeMap.getOrDefault(mysqlType, null);
    }
}