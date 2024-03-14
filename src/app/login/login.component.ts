import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { LoginFormResult } from '../models/loginFormResult';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  private authErrorMessage = new BehaviorSubject<boolean>(false);
  authErrorMessage$ = this.authErrorMessage.asObservable();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  get loginFormControls(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginFormInit();
  }

  private loginFormInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: [''],
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const loginFormResults: LoginFormResult = {
      email: this.loginFormControls['email'].value,
      password: this.loginFormControls['password'].value,
    };

    this.authService
      .login(loginFormResults)
      .pipe(
        tap(() => {
          this.authErrorMessage.next(false);
        }),
        catchError(() => {
          this.authErrorMessage.next(true);
          return EMPTY;
        }),
      )
      .subscribe(() => this.router.navigate([this.authService.DASHBOARD_PATH]));
  }
}
