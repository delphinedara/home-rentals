import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { HomeSearchComponent } from './home-search.component';

describe('HomeSearchComponent', () => {
  let component: HomeSearchComponent;
  let fixture: ComponentFixture<HomeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HomeSearchComponent]
    });

    fixture = TestBed.createComponent(HomeSearchComponent);
    component = fixture.componentInstance;
  });

  it('initializes with the default search value', () => {
    component.defaultSearch = 'Downtown';
    fixture.detectChanges();

    expect(component.form.get('search').value).toBe('Downtown');
  });

  it('emits a search after the debounce interval', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.applied.subscribe(value => emitted.push(value));

    component.form.get('search').setValue('Apartment');

    tick(299);
    expect(emitted).toEqual([]);

    tick(1);
    expect(emitted).toEqual(['Apartment']);
  }));

  it('emits only the latest value during rapid typing', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.applied.subscribe(value => emitted.push(value));

    component.form.get('search').setValue('A');
    tick(100);
    component.form.get('search').setValue('Apartment');
    tick(300);

    expect(emitted).toEqual(['Apartment']);
  }));

  it('emits an empty string when search is cleared', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.applied.subscribe(value => emitted.push(value));

    component.form.get('search').setValue(null);
    tick(300);

    expect(emitted).toEqual(['']);
  }));

  it('updates the form without emitting when defaultSearch changes', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.applied.subscribe(value => emitted.push(value));

    component.defaultSearch = 'Suburbs';
    component.ngOnChanges({
      defaultSearch: new SimpleChange('', 'Suburbs', false)
    });

    tick(300);

    expect(component.form.get('search').value).toBe('Suburbs');
    expect(emitted).toEqual([]);
  }));
});
