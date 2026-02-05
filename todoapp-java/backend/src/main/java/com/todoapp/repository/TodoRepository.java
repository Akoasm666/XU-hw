package com.todoapp.repository;

import com.todoapp.entity.Todo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    /**
     * 根据完成状态查询待办事项
     */
    List<Todo> findByCompleted(Boolean completed, Pageable pageable);
    
    /**
     * 统计完成状态的待办事项数量
     */
    long countByCompleted(Boolean completed);
    
    /**
     * 删除所有已完成的待办事项
     */
    @Modifying
    @Query("DELETE FROM Todo t WHERE t.completed = true")
    int deleteAllCompleted();
}
