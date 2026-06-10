import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { WithdrawalService } from '../../services/withdrawal.service';
import { PortfolioService } from '../../services/portfolio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WithdrawalHistory } from '../../models/user.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-withdrawal-history',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './withdrawal-history.component.html',
  styleUrl: './withdrawal-history.component.css'
})
export class WithdrawalHistoryComponent implements OnInit {
  history: WithdrawalHistory[] = [];
  filterForm: FormGroup;
  errorMessage = '';
  exportMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private withdrawalService: WithdrawalService,
    private portfolioService: PortfolioService
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.withdrawalService.getHistory(userId).subscribe({
      next: (history) => {
        this.history = history;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load withdrawal history';
      }
    });
  }

  exportCsv(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const { startDate, endDate } = this.filterForm.value;
    this.exportMessage = '';

    this.portfolioService.exportCsv(userId, startDate || undefined, endDate || undefined).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `withdrawals_${userId}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.exportMessage = 'CSV downloaded successfully';
      },
      error: (err: HttpErrorResponse) => {
        this.exportMessage = err.error?.message || 'CSV export failed';
      }
    });
  }
}
