package com.enviro.assessment.junior.nqobile.controller;

import com.enviro.assessment.junior.nqobile.dto.UserProfileDTO;
import com.enviro.assessment.junior.nqobile.entity.Withdrawal;
import com.enviro.assessment.junior.nqobile.service.UserService;
import com.enviro.assessment.junior.nqobile.service.WithdrawalService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final UserService userService;
    private final WithdrawalService withdrawalService;

    public PortfolioController(UserService userService, WithdrawalService withdrawalService) {
        this.userService = userService;
        this.withdrawalService = withdrawalService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> getPortfolio(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportWithdrawals(
            @RequestParam Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Withdrawal> withdrawals = withdrawalService.getWithdrawalsForExport(userId, startDate, endDate);

        StringBuilder csv = new StringBuilder();
        csv.append("id,userId,amount,createdAt,status\n");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Withdrawal w : withdrawals) {
            csv.append(w.getId()).append(",")
                    .append(w.getUserId()).append(",")
                    .append(w.getAmount()).append(",")
                    .append(w.getCreatedAt().format(formatter)).append(",")
                    .append(w.getStatus()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "withdrawals_" + userId + ".csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
}
