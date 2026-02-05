package com.todoapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class TodoToggleResponse {

    private Long id;
    private Boolean completed;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public TodoToggleResponse() {}

    public TodoToggleResponse(Long id, Boolean completed, LocalDateTime updatedAt) {
        this.id = id;
        this.completed = completed;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
