package net.kanaries.example.gwdemo.model;

import java.util.HashMap;
import java.util.Map;

public class SemanticTypeMapper {

    private static final Map<String, String> semanticTypeMap;
    static {
        semanticTypeMap = new HashMap<>();
        semanticTypeMap.put("INT", "quantitative");
        semanticTypeMap.put("FLOAT", "quantitative");
        semanticTypeMap.put("DOUBLE", "quantitative");

        semanticTypeMap.put("DATE", "temporal");
        semanticTypeMap.put("TIME", "temporal");
        semanticTypeMap.put("DATETIME", "temporal");
        semanticTypeMap.put("TIMESTAMP", "temporal");

        semanticTypeMap.put("CHAR", "nominal");
        semanticTypeMap.put("VARCHAR", "nominal");
        semanticTypeMap.put("STRING", "nominal");
        semanticTypeMap.put("TEXT", "nominal");
        semanticTypeMap.put("MEDIUMTEXT", "nominal");
        semanticTypeMap.put("LONGTEXT", "nominal");
    }

    public static String mapDataType(String databaseType) {
        return semanticTypeMap.getOrDefault(databaseType, "nominal");
    }

}