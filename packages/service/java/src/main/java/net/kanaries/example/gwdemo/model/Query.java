package net.kanaries.example.gwdemo.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Query {

    private String datasetId;
    private HashMap<String, Object> payload;

    public String getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public HashMap<String, Object> getPayload() {
        return payload;
    }

    public void setPayload(HashMap<String, Object> payload) {
        this.payload = payload;
    }
}
