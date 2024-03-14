import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, finalize, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CatApiService } from '../services/cat-api.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends BaseComponent implements OnInit {
  NUMBER_OF_FACTS_FEED = 20;
  catFacts: string[] = [];
  distance = 1;

  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    private authService: AuthService,
    private router: Router,
    private catApiService: CatApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCatFacts();
  }

  private getCatFacts(): void {
    this.loading.next(true);
    this.catApiService
      .getCatFacts(this.NUMBER_OF_FACTS_FEED)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.loading.next(false)),
      )
      .subscribe((facts) => {
        this.catFacts = [...this.catFacts, ...facts];
      });
  }

  onScroll(): void {
    if (!this.loading.value) {
      this.getCatFacts();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate([this.authService.LOGIN_PATH]);
  }
}
