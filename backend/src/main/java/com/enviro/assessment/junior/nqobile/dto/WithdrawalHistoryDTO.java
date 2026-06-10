package com.enviro.assessment.junior.nqobile.dto;

import java.time.LocalDateTime;

public class WithdrawalHistoryDTO {

    private Long id;
    private Long userId;
    private Double amount;
    private LocalDateTime createdAt;
    private String status;

    public WithdrawalHistoryDTO() {
    }

    public WithdrawalHistoryDTO(Long id, Long userId, Double amount, LocalDateTime createdAt, String status) {
        this.id = id;
        this.userId = userId;
        this.amount = amount;
        this.createdAt = createdAt;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
