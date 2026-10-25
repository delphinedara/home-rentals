import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Home {
  id: number;
  title: string;
  type: string;
  location: string;
  image_url: string;
  monthlyRent: number;
  bedrooms: number;
}

export interface HomesState {
  loading: boolean;
  data: Home[];
  error: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  homes$ = new BehaviorSubject<HomesState>({
    loading: true,
    data: [],
    error: false
  });

  constructor(private httpClient: HttpClient) { }

  loadHomes(
    homeTypeFilters: string[],
    searchString: string,
    maxRent: number = 0,
    minBedrooms: number = 0,
    sort: string = ''
  ) {
    this.homes$.next({
      loading: true,
      data: [],
      error: false
    });

    const allowedTypes = ['Apartment', 'Room', 'House'];
    const types = homeTypeFilters.filter(type => allowedTypes.includes(type));
    const search = (searchString || '').trim().toLowerCase().slice(0, 100);

    this.httpClient.get<Home[]>('assets/homes.json')
      .pipe(
        map(homes => {
          const filtered = homes.filter(home => {
            const matchesType =
              !types.length || types.includes(home.type);

            const text = (home.title + ' ' + home.location).toLowerCase();
            const matchesSearch = !search || text.includes(search);

            const matchesRent = !maxRent || home.monthlyRent <= maxRent;
            const matchesBedrooms =
              !minBedrooms || home.bedrooms >= minBedrooms;

            return matchesType && matchesSearch &&
              matchesRent && matchesBedrooms;
          });

          if (sort === 'price-asc') {
            filtered.sort((a, b) => a.monthlyRent - b.monthlyRent);
          } else if (sort === 'price-desc') {
            filtered.sort((a, b) => b.monthlyRent - a.monthlyRent);
          }

          return filtered;
        })
      )
      .subscribe(
        homes => this.homes$.next({
          loading: false,
          data: homes,
          error: false
        }),
        () => this.homes$.next({
          loading: false,
          data: [],
          error: true
        })
      );
  }

  getAllHomesForShortlist() {
    return this.httpClient.get<Home[]>('assets/homes.json');
  }

}
