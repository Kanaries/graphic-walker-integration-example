package net.kanaries.example.gwdemo.model;


public class Field {
    private String fid;
    private String name;

    private String type;
    private String semanticType;

    public Field(String fid, String name, String type, String semanticType) {
        this.fid = fid;
        this.name = name;
        this.type = type;
        this.semanticType = semanticType;
    }

    public String getFid() {
        return fid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public String getSemanticType() {
        return semanticType;
    }
}
