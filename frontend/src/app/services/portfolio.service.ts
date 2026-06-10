import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolio(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URL}/portfolio/${userId}`);
  }

  updateProfile(userId: number, data: { age?: number; balance?: number }): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${API_URL}/user/${userId}`, data);
  }

  exportCsv(userId: number, startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${API_URL}/portfolio/export?userId=${userId}`;
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    return this.http.get(url, { responseType: 'blob' });
  }
}
