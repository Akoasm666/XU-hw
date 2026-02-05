package com.todoapp.controller;

import com.todoapp.dto.*;
import com.todoapp.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todos")
@Tag(name = "Todo API", description = "待办事项管理接口")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    @Operation(summary = "获取所有待办事项", description = "支持过滤和分页")
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAllTodos(
            @Parameter(description = "过滤完成状态") @RequestParam(required = false) Boolean completed,
            @Parameter(description = "限制返回数量") @RequestParam(defaultValue = "100") Integer limit,
            @Parameter(description = "偏移量") @RequestParam(defaultValue = "0") Integer offset
    ) {
        List<TodoResponse> todos = todoService.getAllTodos(completed, limit, offset);
        long total = todoService.getTotalCount(completed);
        return ResponseEntity.ok(ApiResponse.success(todos, total));
    }

    @PostMapping
    @Operation(summary = "创建待办事项", description = "创建一个新的待办事项")
    public ResponseEntity<ApiResponse<TodoResponse>> createTodo(
            @Valid @RequestBody TodoDTO todoDTO
    ) {
        TodoResponse todo = todoService.createTodo(todoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Todo created successfully", todo));
    }

    @PutMapping("/{todo_id}")
    @Operation(summary = "更新待办事项", description = "更新指定ID的待办事项")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(
            @Parameter(description = "待办事项ID") @PathVariable("todo_id") Long todoId,
            @RequestBody TodoUpdateDTO updateDTO
    ) {
        TodoResponse todo = todoService.updateTodo(todoId, updateDTO);
        return ResponseEntity.ok(ApiResponse.successWithMessage("Todo updated successfully", todo));
    }

    @DeleteMapping("/{todo_id}")
    @Operation(summary = "删除待办事项", description = "删除指定ID的待办事项")
    public ResponseEntity<ApiResponse<Void>> deleteTodo(
            @Parameter(description = "待办事项ID") @PathVariable("todo_id") Long todoId
    ) {
        todoService.deleteTodo(todoId);
        return ResponseEntity.ok(ApiResponse.ok("Todo deleted successfully"));
    }

    @PatchMapping("/{todo_id}/toggle")
    @Operation(summary = "切换完成状态", description = "切换待办事项的完成状态")
    public ResponseEntity<ApiResponse<TodoToggleResponse>> toggleTodoStatus(
            @Parameter(description = "待办事项ID") @PathVariable("todo_id") Long todoId
    ) {
        TodoToggleResponse response = todoService.toggleTodoStatus(todoId);
        return ResponseEntity.ok(ApiResponse.successWithMessage("Todo status toggled successfully", response));
    }

    @DeleteMapping("/completed")
    @Operation(summary = "删除已完成项", description = "批量删除所有已完成的待办事项")
    public ResponseEntity<DeleteResponse> deleteCompletedTodos() {
        int count = todoService.deleteCompletedTodos();
        return ResponseEntity.ok(new DeleteResponse(200, "Completed todos deleted successfully", count));
    }

    @DeleteMapping("/all")
    @Operation(summary = "清空所有待办事项", description = "删除所有待办事项")
    public ResponseEntity<DeleteResponse> deleteAllTodos() {
        int count = todoService.deleteAllTodos();
        return ResponseEntity.ok(new DeleteResponse(200, "All todos deleted successfully", count));
    }
}
