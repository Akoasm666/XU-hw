package com.todoapp.service;

import com.todoapp.dto.*;
import com.todoapp.entity.Todo;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.repository.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private static final Logger log = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * 获取所有待办事项（支持过滤和分页）
     */
    public List<TodoResponse> getAllTodos(Boolean completed, Integer limit, Integer offset) {
        Pageable pageable = PageRequest.of(
            offset / limit,
            limit,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );

        List<Todo> todos;
        if (completed != null) {
            todos = todoRepository.findByCompleted(completed, pageable);
        } else {
            todos = todoRepository.findAll(pageable).getContent();
        }

        return todos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 获取待办事项总数
     */
    public long getTotalCount(Boolean completed) {
        if (completed != null) {
            return todoRepository.countByCompleted(completed);
        }
        return todoRepository.count();
    }

    /**
     * 根据ID获取待办事项
     */
    public TodoResponse getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo with id " + id + " does not exist"));
        return convertToResponse(todo);
    }

    /**
     * 创建待办事项
     */
    @Transactional
    public TodoResponse createTodo(TodoDTO todoDTO) {
        Todo todo = new Todo();
        todo.setTitle(todoDTO.getTitle());
        todo.setDescription(todoDTO.getDescription());
        todo.setCompleted(false);
        todo.setPriority(priorityStringToInt(todoDTO.getPriority()));
        todo.setDueDate(todoDTO.getDueDate());

        Todo savedTodo = todoRepository.save(todo);
        log.info("Created new todo with id: {}", savedTodo.getId());
        return convertToResponse(savedTodo);
    }

    /**
     * 更新待办事项
     */
    @Transactional
    public TodoResponse updateTodo(Long id, TodoUpdateDTO updateDTO) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo with id " + id + " does not exist"));

        if (updateDTO.getTitle() != null) {
            todo.setTitle(updateDTO.getTitle());
        }
        if (updateDTO.getDescription() != null) {
            todo.setDescription(updateDTO.getDescription());
        }
        if (updateDTO.getCompleted() != null) {
            todo.setCompleted(updateDTO.getCompleted());
        }
        if (updateDTO.getPriority() != null) {
            todo.setPriority(priorityStringToInt(updateDTO.getPriority()));
        }
        if (updateDTO.getDueDate() != null) {
            todo.setDueDate(updateDTO.getDueDate());
        }

        Todo updatedTodo = todoRepository.save(todo);
        log.info("Updated todo with id: {}", id);
        return convertToResponse(updatedTodo);
    }

    /**
     * 切换待办事项完成状态
     */
    @Transactional
    public TodoToggleResponse toggleTodoStatus(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo with id " + id + " does not exist"));

        todo.setCompleted(!todo.getCompleted());
        Todo updatedTodo = todoRepository.save(todo);

        log.info("Toggled todo {} status to: {}", id, updatedTodo.getCompleted());

        return new TodoToggleResponse(
            updatedTodo.getId(),
            updatedTodo.getCompleted(),
            updatedTodo.getUpdatedAt()
        );
    }

    /**
     * 删除待办事项
     */
    @Transactional
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Todo with id " + id + " does not exist");
        }
        todoRepository.deleteById(id);
        log.info("Deleted todo with id: {}", id);
    }

    /**
     * 删除所有已完成的待办事项
     */
    @Transactional
    public int deleteCompletedTodos() {
        int count = todoRepository.deleteAllCompleted();
        log.info("Deleted {} completed todos", count);
        return count;
    }

    /**
     * 删除所有待办事项
     */
    @Transactional
    public int deleteAllTodos() {
        long count = todoRepository.count();
        todoRepository.deleteAll();
        log.info("Deleted all {} todos", count);
        return (int) count;
    }

    /**
     * 优先级：字符串 -> 整数
     */
    private Integer priorityStringToInt(String priority) {
        if (priority == null) return 0;
        switch (priority.toLowerCase()) {
            case "high":   return 2;
            case "medium": return 1;
            case "low":
            default:       return 0;
        }
    }

    /**
     * 优先级：整数 -> 字符串
     */
    private String priorityIntToString(Integer priority) {
        if (priority == null) return "low";
        switch (priority) {
            case 2:  return "high";
            case 1:  return "medium";
            case 0:
            default: return "low";
        }
    }

    /**
     * 转换实体为响应DTO
     */
    private TodoResponse convertToResponse(Todo todo) {
        return new TodoResponse(
            todo.getId(),
            todo.getTitle(),
            todo.getDescription(),
            todo.getCompleted(),
            priorityIntToString(todo.getPriority()),
            todo.getDueDate(),
            todo.getCreatedAt(),
            todo.getUpdatedAt()
        );
    }
}
