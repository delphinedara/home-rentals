import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { DataService, Home } from '../data.service';
import { SavedHomesService } from '../saved-homes.service';
import { HomesComponent } from './homes.component';

describe('HomesComponent', () => {
  let component: HomesComponent;
  let fixture: ComponentFixture<HomesComponent>;
  let queryParams: BehaviorSubject<Params>;
  let dataService: jasmine.SpyObj<DataService>;
  let savedService: jasmine.SpyObj<SavedHomesService>;
  let router: jasmine.SpyObj<Router>;

  const homes: Home[] = [
    {
      id: 1, title: 'Apartment', type: 'Apartment',
      location: 'Downtown', image_url: '',
      monthlyRent: 1500, bedrooms: 2
    },
    {
      id: 2, title: 'House', type: 'House',
      location: 'Suburbs', image_url: '',
      monthlyRent: 2500, bedrooms: 4
    }
  ];

  beforeEach(() => {
    queryParams = new BehaviorSubject<Params>({});

    dataService = jasmine.createSpyObj('DataService', [
      'loadHomes', 'getAllHomesForShortlist'
    ]);
    dataService.getAllHomesForShortlist.and.returnValue(of(homes));

    savedService = jasmine.createSpyObj('SavedHomesService', [
      'toggle', 'isSaved', 'clear'
    ]);
    savedService.savedIds$ = new BehaviorSubject<number[]>([]);

    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [HomesComponent],
      providers: [
        { provide: DataService, useValue: dataService },
        { provide: SavedHomesService, useValue: savedService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams.asObservable() }
        }
      ]
    })
    .overrideComponent(HomesComponent, {
      set: { template: '' }
    });

    fixture = TestBed.createComponent(HomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the catalog on initialization', () => {
    expect(dataService.loadHomes).toHaveBeenCalledWith(
      [], '', 0, 0, ''
    );
    expect(component.allHomes).toEqual(homes);
  });

  it('accepts valid URL filters', () => {
    queryParams.next({
      'home-type': ['Apartment', 'House'],
      search: 'Downtown',
      maxRent: '2000',
      minBedrooms: '2',
      sort: 'price-asc'
    });

    expect(dataService.loadHomes).toHaveBeenCalledWith(
      ['Apartment', 'House'], 'Downtown', 2000, 2, 'price-asc'
    );
  });

  it('rejects invalid numeric filters and sorting', () => {
    queryParams.next({
      maxRent: '-100',
      minBedrooms: '999',
      sort: 'unknown'
    });

    expect(dataService.loadHomes).toHaveBeenCalledWith(
      [], '', 0, 0, ''
    );
  });

  it('ignores unsupported property types', () => {
    queryParams.next({
      'home-type': ['Apartment', 'Invalid']
    });

    expect(component.currentHomeTypeFilters).toEqual(['Apartment']);
  });

  it('calculates saved-property monthly totals', () => {
    expect(component.monthlyTotal([1, 2])).toBe(4000);
    expect(component.monthlyTotal([1])).toBe(1500);
    expect(component.monthlyTotal([])).toBe(0);
  });

  it('delegates saving and clearing to SavedHomesService', () => {
    component.toggleSaved(1);
    component.clearSaved();

    expect(savedService.toggle).toHaveBeenCalledWith(1);
    expect(savedService.clear).toHaveBeenCalled();
  });

  it('updates search through router navigation', () => {
    component.searchApplied('  downtown  ');

    expect(router.navigate).toHaveBeenCalledWith(
      ['/homes'],
      {
        queryParams: { search: 'downtown' },
        queryParamsHandling: 'merge'
      }
    );
  });

  it('clears filters and saved-only display state', () => {
    component.showSavedOnly = true;
    component.homeTypeDropdownOpen = true;

    component.clearFilters();

    expect(component.showSavedOnly).toBe(false);
    expect(component.homeTypeDropdownOpen).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/homes'], { queryParams: {} }
    );
  });
});
