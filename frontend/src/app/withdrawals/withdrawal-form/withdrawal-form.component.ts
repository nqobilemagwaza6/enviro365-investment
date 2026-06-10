import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { WithdrawalService } from '../../services/withdrawal.service';
import { PortfolioService } from '../../services/portfolio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-withdrawal-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './withdrawal-form.component.html',
  styleUrl: './withdrawal-form.component.css',
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
    private portfolioService: PortfolioService,
  ) {
    this.withdrawalForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
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
      },
    });
  }

  onSubmit(): void {
    if (this.withdrawalForm.invalid) {
      this.withdrawalForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid withdrawal amount (greater than 0)',
      });

      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    const amount = this.withdrawalForm.value.amount;

    this.loading = true;

    this.withdrawalService.withdraw(userId, amount).subscribe({
      next: (res: any) => {
        this.loading = false;

        const remaining = res.remainingBalance;

        this.withdrawalForm.reset();

        Swal.fire({
          icon: 'success',
          title: 'Withdrawal Successful',
          text: `${res.message}. Remaining balance: R${remaining}`,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
            window.location.reload();
          })
      },

      error: (err: any) => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Withdrawal Failed',
          text: err.error?.message || 'Something went wrong',
        });
      },
    });
  }
}
