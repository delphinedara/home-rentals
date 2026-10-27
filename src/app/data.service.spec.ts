import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService, Home } from './data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const homes: Home[] = [
    {
      id: 1, title: 'City Apartment', type: 'Apartment',
      location: 'Downtown', image_url: '',
      monthlyRent: 1600, bedrooms: 2
    },
    {
      id: 2, title: 'Family House', type: 'House',
      location: 'Suburbs', image_url: '',
      monthlyRent: 2400, bedrooms: 4
    },
    {
      id: 3, title: 'Budget Room', type: 'Room',
      location: 'Downtown', image_url: '',
      monthlyRent: 800, bedrooms: 1
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function respondWithHomes() {
    const request = httpMock.expectOne('assets/homes.json');
    expect(request.request.method).toBe('GET');
    request.flush(homes);
  }

  it('loads all homes without filters', () => {
    service.loadHomes([], '');
    respondWithHomes();

    expect(service.homes$.value.data.length).toBe(3);
    expect(service.homes$.value.error).toBe(false);
    expect(service.homes$.value.loading).toBe(false);
  });

  it('filters by property type', () => {
    service.loadHomes(['Apartment'], '');
    respondWithHomes();

    expect(service.homes$.value.data.map(home => home.id)).toEqual([1]);
  });

  it('searches titles and locations case-insensitively', () => {
    service.loadHomes([], '  DOWNTOWN  ');
    respondWithHomes();

    expect(service.homes$.value.data.map(home => home.id)).toEqual([1, 3]);
  });

  it('filters by maximum rent and minimum bedrooms', () => {
    service.loadHomes([], '', 2000, 2);
    respondWithHomes();

    expect(service.homes$.value.data.map(home => home.id)).toEqual([1]);
  });

  it('sorts by ascending rent', () => {
    service.loadHomes([], '', 0, 0, 'price-asc');
    respondWithHomes();

    expect(service.homes$.value.data.map(home => home.id)).toEqual([3, 1, 2]);
  });

  it('sorts by descending rent', () => {
    service.loadHomes([], '', 0, 0, 'price-desc');
    respondWithHomes();

    expect(service.homes$.value.data.map(home => home.id)).toEqual([2, 1, 3]);
  });

  it('ignores unsupported property types', () => {
    service.loadHomes(['InvalidType'], '');
    respondWithHomes();

    expect(service.homes$.value.data.length).toBe(3);
  });

  it('returns an empty result for unmatched searches', () => {
    service.loadHomes([], 'nonexistent property');
    respondWithHomes();

    expect(service.homes$.value.data).toEqual([]);
  });

  it('sets an error state when the HTTP request fails', () => {
    service.loadHomes([], '');

    const request = httpMock.expectOne('assets/homes.json');
    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(service.homes$.value.error).toBe(true);
    expect(service.homes$.value.loading).toBe(false);
    expect(service.homes$.value.data).toEqual([]);
  });
});
