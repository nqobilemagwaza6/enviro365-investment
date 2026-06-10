package com.enviro.assessment.junior.nqobile.service;

import com.enviro.assessment.junior.nqobile.dto.WithdrawalHistoryDTO;
import com.enviro.assessment.junior.nqobile.dto.WithdrawalResponse;
import com.enviro.assessment.junior.nqobile.entity.User;
import com.enviro.assessment.junior.nqobile.entity.Withdrawal;
import com.enviro.assessment.junior.nqobile.repository.UserRepository;
import com.enviro.assessment.junior.nqobile.repository.WithdrawalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WithdrawalService {

    private static final Logger log = LoggerFactory.getLogger(WithdrawalService.class);

    private final UserService userService;
    private final UserRepository userRepository;
    private final WithdrawalRepository withdrawalRepository;

    public WithdrawalService(UserService userService,
                             UserRepository userRepository,
                             WithdrawalRepository withdrawalRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.withdrawalRepository = withdrawalRepository;
    }

    @Transactional
    public WithdrawalResponse processWithdrawal(Long userId, Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Withdrawal denied: Invalid amount");
        }

        User user = userService.findUserById(userId);

        if (user.getAge() <= 65) {
            throw new IllegalArgumentException("Withdrawal denied: User must be over 65 years old");
        }

        double balance = user.getBalance();
        double maxAllowed = balance * 0.9;

        if (amount > balance) {
            throw new IllegalArgumentException("Withdrawal denied: Insufficient balance");
        }

        if (amount > maxAllowed) {
            throw new IllegalArgumentException("Withdrawal denied: Amount exceeds 90% of balance");
        }

        user.setBalance(balance - amount);
        user = userRepository.save(user);

        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setUserId(userId);
        withdrawal.setAmount(amount);
        withdrawal.setCreatedAt(LocalDateTime.now());
        withdrawal.setStatus("SUCCESS");
        withdrawalRepository.save(withdrawal);

        log.info("Withdrawal processed for user {}: amount={}, remaining={}", userId, amount, user.getBalance());

        return new WithdrawalResponse("Withdrawal successful", user.getBalance());
    }

    public List<WithdrawalHistoryDTO> getWithdrawalHistory(Long userId) {
        userService.findUserById(userId);
        return withdrawalRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toHistoryDTO)
                .collect(Collectors.toList());
    }

    public List<Withdrawal> getWithdrawalsForExport(Long userId, LocalDate startDate, LocalDate endDate) {
        userService.findUserById(userId);

        if (startDate != null && endDate != null) {
            LocalDateTime start = startDate.atStartOfDay();
            LocalDateTime end = endDate.atTime(LocalTime.MAX);
            return withdrawalRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, start, end);
        }

        return withdrawalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private WithdrawalHistoryDTO toHistoryDTO(Withdrawal withdrawal) {
        return new WithdrawalHistoryDTO(
                withdrawal.getId(),
                withdrawal.getUserId(),
                withdrawal.getAmount(),
                withdrawal.getCreatedAt(),
                withdrawal.getStatus()
        );
    }
}
