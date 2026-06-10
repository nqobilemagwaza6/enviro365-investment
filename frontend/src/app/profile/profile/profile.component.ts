import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: UserProfile | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private portfolioService: PortfolioService
  ) {
    this.profileForm = this.fb.group({
      age: [0, [Validators.required, Validators.min(0)]],
      balance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.portfolioService.getPortfolio(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          age: profile.age,
          balance: profile.balance
        });
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load profile';
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.portfolioService.updateProfile(userId, this.profileForm.value).subscribe({
      next: (profile) => {
        this.loading = false;
        this.profile = profile;
        this.successMessage = 'Profile updated successfully';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update profile';
      }
    });
  }
}
