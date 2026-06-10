import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ProfileStateService } from '../../services/profile-state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../../models/user.model';
import Swal from 'sweetalert2';

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
    private portfolioService: PortfolioService,
    private profileState: ProfileStateService
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
    const cached = this.profileState.profile();
    if (cached) {
      this.applyProfile(cached);
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.profileState.loadProfile(userId).subscribe({
      next: (profile) => this.applyProfile(profile),
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load profile';
      }
    });
  }

  private applyProfile(profile: UserProfile): void {
    this.profile = profile;
    this.profileForm.patchValue({
      age: profile.age,
      balance: profile.balance
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
        this.profileForm.patchValue({
          age: profile.age,
          balance: profile.balance,
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
            window.location.reload();
            })
      },
      error: (err) => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Failed to update profile',
        });
      },
    });
  }
}
