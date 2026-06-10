import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/user.model';

const API_URL = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'enviro_jwt';
  private readonly userIdKey = 'enviro_user_id';

  currentUserId = signal<number | null>(this.getStoredUserId());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age?: number;
    balance?: number;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/register`, data).pipe(
      tap((response) => this.storeAuth(response))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, { email, password }).pipe(
      tap((response) => this.storeAuth(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    this.currentUserId.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserId(): number | null {
    return this.currentUserId();
  }

  private storeAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userIdKey, String(response.userId));
    this.currentUserId.set(response.userId);
  }

  private getStoredUserId(): number | null {
    const id = localStorage.getItem(this.userIdKey);
    return id ? Number(id) : null;
  }
}
