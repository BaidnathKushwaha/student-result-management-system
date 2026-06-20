package com.resultmanagement.repository;

import com.resultmanagement.entity.User;
import com.resultmanagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByReferenceId(Long referenceId);

    boolean existsByReferenceIdAndRole(Long referenceId, Role role);

    Optional<User> findByReferenceIdAndRole(Long referenceId, Role role);
}
