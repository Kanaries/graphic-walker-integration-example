package net.kanaries.example.gwdemo.model;


import java.util.List;

public class Dataset {
    private String name;
    private String datasetId;
    private List<Field> fieldsMeta;

    public Dataset(String name, String datasetId, List<Field> fieldsMeta) {
        this.name = name;
        this.datasetId = datasetId;
        this.fieldsMeta = fieldsMeta;
    }

    public String getName() {
        return name;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public List<Field> getFieldsMeta() {
        return fieldsMeta;
    }
}
