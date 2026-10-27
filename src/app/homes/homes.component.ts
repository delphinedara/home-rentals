import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Home } from '../data.service';
import { SavedHomesService } from '../saved-homes.service';

@Component({
  standalone: false,
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.css']
})
export class HomesComponent implements OnInit {
  homeTypeDropdownOpen = false;
  currentHomeTypeFilters: string[] = [];
  currentSearch = '';
  maxRent = 0;
  minBedrooms = 0;
  sort = '';
  showSavedOnly = false;

  homes$ = this.dataService.homes$;
  savedIds$ = this.savedHomesService.savedIds$;

  allHomes: Home[] = [];

  constructor(
    private dataService: DataService,
    private savedHomesService: SavedHomesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const rawTypes = params['home-type'];
      const types = Array.isArray(rawTypes)
        ? rawTypes
        : rawTypes ? [rawTypes] : [];

      this.currentHomeTypeFilters = types.filter(type =>
        ['Apartment', 'Room', 'House'].includes(type)
      );

      this.currentSearch = String(params.search || '').slice(0, 100);
      this.maxRent = this.validNumber(params.maxRent, 100000);
      this.minBedrooms = this.validNumber(params.minBedrooms, 20);
      this.sort = ['price-asc', 'price-desc'].includes(params.sort)
        ? params.sort
        : '';

      this.dataService.loadHomes(
        this.currentHomeTypeFilters,
        this.currentSearch,
        this.maxRent,
        this.minBedrooms,
        this.sort
      );
    });

    this.dataService.getAllHomesForShortlist().subscribe(
      homes => this.allHomes = homes,
      () => this.allHomes = []
    );
  }

  private validNumber(value: any, maximum: number): number {
    if (value === undefined || value === null || value === '') {
      return 0;
    }

    const numberValue = Number(value);

    return Number.isFinite(numberValue) &&
      Number.isInteger(numberValue) &&
      numberValue >= 0 &&
      numberValue <= maximum
      ? numberValue
      : 0;
  }

  homeTypeFilterApplied(types: string[]) {
    this.homeTypeDropdownOpen = false;
    this.updateQuery({ 'home-type': types.length ? types : null });
  }

  searchApplied(value: string) {
    this.updateQuery({ search: (value || '').trim().slice(0, 100) || null });
  }

  updateMaxRent(value: string) {
    this.updateQuery({ maxRent: value || null });
  }

  updateBedrooms(value: string) {
    this.updateQuery({ minBedrooms: value || null });
  }

  updateSort(value: string) {
    this.updateQuery({ sort: value || null });
  }

  private updateQuery(queryParams: any) {
    this.router.navigate(['/homes'], {
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  clearFilters() {
    this.homeTypeDropdownOpen = false;
    this.showSavedOnly = false;

    this.router.navigate(['/homes'], {
      queryParams: {}
    });
  }

  toggleSaved(id: number) {
    this.savedHomesService.toggle(id);
  }

  isSaved(id: number): boolean {
    return this.savedHomesService.isSaved(id);
  }

  clearSaved() {
    this.savedHomesService.clear();
  }

  savedHomes(ids: number[]): Home[] {
    return this.allHomes.filter(home => ids.includes(home.id));
  }

  monthlyTotal(ids: number[]): number {
    return this.savedHomes(ids).reduce(
      (total, home) => total + home.monthlyRent,
      0
    );
  }

  trackByHomeId(index: number, home: Home): number {
    return home.id;
  }
}
