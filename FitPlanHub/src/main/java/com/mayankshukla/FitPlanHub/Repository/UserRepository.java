package com.mayankshukla.FitPlanHub.Repository;


import com.mayankshukla.FitPlanHub.Entity.Role;
import com.mayankshukla.FitPlanHub.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}