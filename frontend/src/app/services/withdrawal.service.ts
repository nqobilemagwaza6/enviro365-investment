import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WithdrawalHistory, WithdrawalResponse } from '../models/user.model';

const API_URL = 'http://localhost:8080/api/withdrawals';

@Injectable({ providedIn: 'root' })
export class WithdrawalService {
  constructor(private http: HttpClient) {}

  withdraw(userId: number, amount: number): Observable<WithdrawalResponse> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.post<WithdrawalResponse>(`${API_URL}/${userId}`, null, { params });
  }

  getHistory(userId: number): Observable<WithdrawalHistory[]> {
    return this.http.get<WithdrawalHistory[]>(`${API_URL}/${userId}`);
  }
}
