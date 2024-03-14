import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { LoginFormResult } from '../models/loginFormResult';
import { admin } from '../mocks/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly LOGIN_PATH = '/login';
  public readonly CONFIRM_PATH = '/confirm';
  public readonly DASHBOARD_PATH = '/dashboard';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  login(loginRequest: LoginFormResult): Observable<User> {
    const mockUser = admin;
    if (loginRequest.email === mockUser.email && loginRequest.password === mockUser.password) {
      localStorage.setItem('loggedIn', 'true');
      return of(admin);
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  isLoggedIn$(): Observable<boolean> {
    const getLoggedIn = !!localStorage.getItem('loggedIn');
    return of(getLoggedIn);
  }

  logout(): void {
    localStorage.setItem('loggedIn', '');
  }
}
