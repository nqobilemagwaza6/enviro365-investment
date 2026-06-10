package com.enviro.assessment.junior.nqobile.dto;

public class WithdrawalResponse {

    private String message;
    private Double remainingBalance;

    public WithdrawalResponse() {
    }

    public WithdrawalResponse(String message, Double remainingBalance) {
        this.message = message;
        this.remainingBalance = remainingBalance;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Double getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(Double remainingBalance) {
        this.remainingBalance = remainingBalance;
    }
}
