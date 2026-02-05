package com.todoapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.dto.*;
import com.todoapp.exception.GlobalExceptionHandler;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
@DisplayName("TodoController 集成测试")
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TodoService todoService;

    private TodoResponse testTodoResponse;

    @BeforeEach
    void setUp() {
        testTodoResponse = new TodoResponse(
                1L,
                "测试待办事项",
                "测试描述",
                false,
                "medium",
                null,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("测试获取所有待办事项API")
    void testGetAllTodos() throws Exception {
        List<TodoResponse> todos = Arrays.asList(testTodoResponse);
        when(todoService.getAllTodos(any(), anyInt(), anyInt())).thenReturn(todos);
        when(todoService.getTotalCount(any())).thenReturn(1L);

        mockMvc.perform(get("/api/v1/todos")
                        .param("limit", "100")
                        .param("offset", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").value("测试待办事项"))
                .andExpect(jsonPath("$.total").value(1));

        verify(todoService, times(1)).getAllTodos(any(), anyInt(), anyInt());
        verify(todoService, times(1)).getTotalCount(any());
    }

    @Test
    @DisplayName("测试创建待办事项API")
    void testCreateTodo() throws Exception {
        TodoDTO todoDTO = new TodoDTO();
        todoDTO.setTitle("新待办事项");
        todoDTO.setDescription("新描述");
        todoDTO.setPriority("medium");

        when(todoService.createTodo(any(TodoDTO.class))).thenReturn(testTodoResponse);

        mockMvc.perform(post("/api/v1/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(todoDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.message").value("Todo created successfully"))
                .andExpect(jsonPath("$.data.id").value(1));

        verify(todoService, times(1)).createTodo(any(TodoDTO.class));
    }

    @Test
    @DisplayName("测试创建待办事项时标题为空返回400")
    void testCreateTodoWithEmptyTitle() throws Exception {
        TodoDTO todoDTO = new TodoDTO();
        todoDTO.setTitle("");
        todoDTO.setDescription("描述");

        mockMvc.perform(post("/api/v1/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(todoDTO)))
                .andExpect(status().isBadRequest());

        verify(todoService, never()).createTodo(any(TodoDTO.class));
    }

    @Test
    @DisplayName("测试更新待办事项API")
    void testUpdateTodo() throws Exception {
        TodoUpdateDTO updateDTO = new TodoUpdateDTO();
        updateDTO.setTitle("更新后的标题");
        updateDTO.setCompleted(true);

        when(todoService.updateTodo(eq(1L), any(TodoUpdateDTO.class))).thenReturn(testTodoResponse);

        mockMvc.perform(put("/api/v1/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Todo updated successfully"))
                .andExpect(jsonPath("$.data.id").value(1));

        verify(todoService, times(1)).updateTodo(eq(1L), any(TodoUpdateDTO.class));
    }

    @Test
    @DisplayName("测试更新不存在的待办事项返回404")
    void testUpdateTodoNotFound() throws Exception {
        TodoUpdateDTO updateDTO = new TodoUpdateDTO();
        updateDTO.setTitle("更新后的标题");

        when(todoService.updateTodo(eq(999L), any(TodoUpdateDTO.class)))
                .thenThrow(new ResourceNotFoundException("Todo with id 999 does not exist"));

        mockMvc.perform(put("/api/v1/todos/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));

        verify(todoService, times(1)).updateTodo(eq(999L), any(TodoUpdateDTO.class));
    }

    @Test
    @DisplayName("测试删除待办事项API")
    void testDeleteTodo() throws Exception {
        doNothing().when(todoService).deleteTodo(1L);

        mockMvc.perform(delete("/api/v1/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Todo deleted successfully"));

        verify(todoService, times(1)).deleteTodo(1L);
    }

    @Test
    @DisplayName("测试切换待办事项完成状态API")
    void testToggleTodoStatus() throws Exception {
        TodoToggleResponse toggleResponse = new TodoToggleResponse(1L, true, LocalDateTime.now());
        when(todoService.toggleTodoStatus(1L)).thenReturn(toggleResponse);

        mockMvc.perform(patch("/api/v1/todos/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Todo status toggled successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.completed").value(true));

        verify(todoService, times(1)).toggleTodoStatus(1L);
    }

    @Test
    @DisplayName("测试批量删除已完成待办事项API")
    void testDeleteCompletedTodos() throws Exception {
        when(todoService.deleteCompletedTodos()).thenReturn(5);

        mockMvc.perform(delete("/api/v1/todos/completed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Completed todos deleted successfully"))
                .andExpect(jsonPath("$.deleted_count").value(5));

        verify(todoService, times(1)).deleteCompletedTodos();
    }

    @Test
    @DisplayName("测试清空所有待办事项API")
    void testDeleteAllTodos() throws Exception {
        when(todoService.deleteAllTodos()).thenReturn(10);

        mockMvc.perform(delete("/api/v1/todos/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("All todos deleted successfully"))
                .andExpect(jsonPath("$.deleted_count").value(10));

        verify(todoService, times(1)).deleteAllTodos();
    }
}
