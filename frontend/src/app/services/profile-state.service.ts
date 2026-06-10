import { Injectable, signal } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { PortfolioService } from './portfolio.service';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  profile = signal<UserProfile | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private portfolioService: PortfolioService) {}

  loadProfile(userId: number): Observable<UserProfile> {
    this.loading.set(true);
    this.error.set(null);

    return this.portfolioService.getPortfolio(userId).pipe(
      tap((profile) => this.profile.set(profile)),
      finalize(() => this.loading.set(false))
    );
  }

  clear(): void {
    this.profile.set(null);
    this.error.set(null);
    this.loading.set(false);
  }

  setError(message: string): void {
    this.error.set(message);
    this.loading.set(false);
  }
}
