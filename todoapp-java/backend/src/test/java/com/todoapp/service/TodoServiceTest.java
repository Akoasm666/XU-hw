package com.todoapp.service;

import com.todoapp.dto.TodoDTO;
import com.todoapp.dto.TodoResponse;
import com.todoapp.dto.TodoToggleResponse;
import com.todoapp.dto.TodoUpdateDTO;
import com.todoapp.entity.Todo;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TodoService 单元测试")
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private Todo testTodo;

    @BeforeEach
    void setUp() {
        testTodo = new Todo();
        testTodo.setId(1L);
        testTodo.setTitle("测试待办事项");
        testTodo.setDescription("测试描述");
        testTodo.setCompleted(false);
        testTodo.setPriority(1);
        testTodo.setCreatedAt(LocalDateTime.now());
        testTodo.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("测试获取所有待办事项")
    void testGetAllTodos() {
        List<Todo> todos = Arrays.asList(testTodo);
        when(todoRepository.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(todos));

        List<TodoResponse> result = todoService.getAllTodos(null, 100, 0);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("测试待办事项", result.get(0).getTitle());
        verify(todoRepository, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("测试根据完成状态过滤待办事项")
    void testGetAllTodosWithCompletedFilter() {
        List<Todo> todos = Arrays.asList(testTodo);
        when(todoRepository.findByCompleted(eq(false), any(Pageable.class)))
                .thenReturn(todos);

        List<TodoResponse> result = todoService.getAllTodos(false, 100, 0);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(todoRepository, times(1)).findByCompleted(eq(false), any(Pageable.class));
    }

    @Test
    @DisplayName("测试创建待办事项")
    void testCreateTodo() {
        TodoDTO todoDTO = new TodoDTO();
        todoDTO.setTitle("新待办事项");
        todoDTO.setDescription("新描述");
        todoDTO.setPriority("high");

        when(todoRepository.save(any(Todo.class))).thenReturn(testTodo);

        TodoResponse result = todoService.createTodo(todoDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    @DisplayName("测试根据ID获取待办事项")
    void testGetTodoById() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(testTodo));

        TodoResponse result = todoService.getTodoById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试待办事项", result.getTitle());
        verify(todoRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("测试获取不存在的待办事项抛出异常")
    void testGetTodoByIdNotFound() {
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            todoService.getTodoById(999L);
        });
        verify(todoRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("测试更新待办事项")
    void testUpdateTodo() {
        TodoUpdateDTO updateDTO = new TodoUpdateDTO();
        updateDTO.setTitle("更新后的标题");
        updateDTO.setCompleted(true);
        updateDTO.setPriority("high");

        when(todoRepository.findById(1L)).thenReturn(Optional.of(testTodo));
        when(todoRepository.save(any(Todo.class))).thenReturn(testTodo);

        TodoResponse result = todoService.updateTodo(1L, updateDTO);

        assertNotNull(result);
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    @DisplayName("测试切换待办事项完成状态")
    void testToggleTodoStatus() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(testTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
            Todo saved = invocation.getArgument(0);
            saved.setUpdatedAt(LocalDateTime.now());
            return saved;
        });

        TodoToggleResponse result = todoService.toggleTodoStatus(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertTrue(result.getCompleted());
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    @DisplayName("测试删除待办事项")
    void testDeleteTodo() {
        when(todoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(todoRepository).deleteById(1L);

        todoService.deleteTodo(1L);

        verify(todoRepository, times(1)).existsById(1L);
        verify(todoRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("测试删除不存在的待办事项抛出异常")
    void testDeleteTodoNotFound() {
        when(todoRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            todoService.deleteTodo(999L);
        });
        verify(todoRepository, times(1)).existsById(999L);
        verify(todoRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("测试删除所有已完成的待办事项")
    void testDeleteCompletedTodos() {
        when(todoRepository.deleteAllCompleted()).thenReturn(5);

        int result = todoService.deleteCompletedTodos();

        assertEquals(5, result);
        verify(todoRepository, times(1)).deleteAllCompleted();
    }

    @Test
    @DisplayName("测试删除所有待办事项")
    void testDeleteAllTodos() {
        when(todoRepository.count()).thenReturn(10L);
        doNothing().when(todoRepository).deleteAll();

        int result = todoService.deleteAllTodos();

        assertEquals(10, result);
        verify(todoRepository, times(1)).count();
        verify(todoRepository, times(1)).deleteAll();
    }

    @Test
    @DisplayName("测试获取总数")
    void testGetTotalCount() {
        when(todoRepository.count()).thenReturn(10L);

        long result = todoService.getTotalCount(null);

        assertEquals(10L, result);
        verify(todoRepository, times(1)).count();
    }

    @Test
    @DisplayName("测试根据完成状态获取总数")
    void testGetTotalCountByCompleted() {
        when(todoRepository.countByCompleted(false)).thenReturn(7L);

        long result = todoService.getTotalCount(false);

        assertEquals(7L, result);
        verify(todoRepository, times(1)).countByCompleted(false);
    }
}
