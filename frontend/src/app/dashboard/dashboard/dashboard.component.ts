import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../../models/user.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  profile: UserProfile | null = null;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.portfolioService.getPortfolio(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load portfolio';
      }
    });
  }
}
