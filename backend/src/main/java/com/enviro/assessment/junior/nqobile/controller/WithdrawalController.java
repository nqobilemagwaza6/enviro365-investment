package com.enviro.assessment.junior.nqobile.controller;

import com.enviro.assessment.junior.nqobile.dto.WithdrawalHistoryDTO;
import com.enviro.assessment.junior.nqobile.dto.WithdrawalResponse;
import com.enviro.assessment.junior.nqobile.service.WithdrawalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/withdrawals")
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    public WithdrawalController(WithdrawalService withdrawalService) {
        this.withdrawalService = withdrawalService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<WithdrawalResponse> withdraw(
            @PathVariable Long userId,
            @RequestParam Double amount) {
        return ResponseEntity.ok(withdrawalService.processWithdrawal(userId, amount));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WithdrawalHistoryDTO>> getWithdrawals(@PathVariable Long userId) {
        return ResponseEntity.ok(withdrawalService.getWithdrawalHistory(userId));
    }
}
