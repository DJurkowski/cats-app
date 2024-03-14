import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCard, MatCardContent } from '@angular/material/card';

import { of } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../services/auth.service';
import { CatApiService } from '../services/cat-api.service';
import { mockFactsArray } from '../mocks/catFacts';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let catApiService: jasmine.SpyObj<CatApiService>;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', ['logout']);
    catApiService = jasmine.createSpyObj('CatApiService', {
      getCatFacts: of(mockFactsArray),
    });

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule, InfiniteScrollModule, MatCard, MatCardContent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: CatApiService, useValue: catApiService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCatFacts on initialization', () => {
    expect(catApiService.getCatFacts).toHaveBeenCalledWith(component.NUMBER_OF_FACTS_FEED);
  });
});
