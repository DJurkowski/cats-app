import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, forkJoin, map, mergeMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatApiService {
  factCats: string[] = [];

  constructor(private httpClient: HttpClient) {}

  getCatFact(): Observable<string> {
    return this.httpClient.get<any>('https://meowfacts.herokuapp.com/').pipe(map((response) => response.data[0]));
  }

  getUniqueFact(): Observable<string> {
    return this.getCatFact().pipe(
      mergeMap((fact) => {
        if (fact && !this.factCats.includes(fact)) {
          this.factCats.push(fact);
          return of(fact);
        }
        return this.getUniqueFact();
      }),
    );
  }

  getCatFacts(numberOfFacts: number): Observable<string[]> {
    const requests: Observable<string>[] = [];

    for (let i = 0; i < numberOfFacts; i++) {
      requests.push(this.getUniqueFact());
    }

    return forkJoin([...requests]);
  }
}
