import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { WithdrawalFormComponent } from './withdrawals/withdrawal-form/withdrawal-form.component';
import { WithdrawalHistoryComponent } from './withdrawals/withdrawal-history/withdrawal-history.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'withdrawals', component: WithdrawalFormComponent, canActivate: [authGuard] },
  { path: 'withdrawals/history', component: WithdrawalHistoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
