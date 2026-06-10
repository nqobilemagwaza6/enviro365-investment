package com.enviro.assessment.junior.nqobile.repository;

import com.enviro.assessment.junior.nqobile.entity.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    List<Withdrawal> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Withdrawal> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId, LocalDateTime start, LocalDateTime end);
}
