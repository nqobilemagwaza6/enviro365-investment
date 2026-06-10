import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { WithdrawalService } from '../../services/withdrawal.service';
import { PortfolioService } from '../../services/portfolio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-withdrawal-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './withdrawal-form.component.html',
  styleUrl: './withdrawal-form.component.css'
})
export class WithdrawalFormComponent implements OnInit {
  withdrawalForm: FormGroup;
  currentBalance = 0;
  maxWithdrawal = 0;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private withdrawalService: WithdrawalService,
    private portfolioService: PortfolioService
  ) {
    this.withdrawalForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.portfolioService.getPortfolio(userId).subscribe({
      next: (profile) => {
        this.currentBalance = profile.balance;
        this.maxWithdrawal = profile.balance * 0.9;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load balance';
      }
    });
  }

  onSubmit(): void {
    if (this.withdrawalForm.invalid) {
      this.withdrawalForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    const amount = this.withdrawalForm.value.amount;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.withdrawalService.withdraw(userId, amount).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = `${response.message}. Remaining balance: $${response.remainingBalance}`;
        this.currentBalance = response.remainingBalance;
        this.maxWithdrawal = response.remainingBalance * 0.9;
        this.withdrawalForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Withdrawal failed';
      }
    });
  }
}
