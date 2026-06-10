import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileStateService } from '../../services/profile-state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public profileState: ProfileStateService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.profileState.setError('User not logged in');
      return;
    }

    if (this.profileState.profile()) {
      return;
    }

    this.profileState.loadProfile(userId).subscribe({
      error: (err: HttpErrorResponse) => {
        this.profileState.setError(err.error?.message || 'Failed to load portfolio');
      },
    });
  }
}
