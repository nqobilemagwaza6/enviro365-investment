package com.enviro.assessment.junior.nqobile.dto;

import jakarta.validation.constraints.Min;

public class UpdateUserRequest {

    @Min(value = 0, message = "Age must be zero or positive")
    private Integer age;

    @Min(value = 0, message = "Balance must be zero or positive")
    private Double balance;

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}
