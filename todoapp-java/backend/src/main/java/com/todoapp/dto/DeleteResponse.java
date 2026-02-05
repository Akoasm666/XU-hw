package com.todoapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeleteResponse {

    private Integer code;
    private String message;

    @JsonProperty("deleted_count")
    private Integer deletedCount;

    public DeleteResponse() {}

    public DeleteResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public DeleteResponse(Integer code, String message, Integer deletedCount) {
        this.code = code;
        this.message = message;
        this.deletedCount = deletedCount;
    }

    public Integer getCode() { return code; }
    public void setCode(Integer code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Integer getDeletedCount() { return deletedCount; }
    public void setDeletedCount(Integer deletedCount) { this.deletedCount = deletedCount; }
}
