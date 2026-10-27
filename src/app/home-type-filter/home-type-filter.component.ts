import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-home-type-filter',
  templateUrl: './home-type-filter.component.html'
})
export class HomeTypeFilterComponent implements OnInit {

  @Input() defaultFilters = [];
  @Output() applied = new EventEmitter();

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      Apartment: [this.defaultFilters.includes('Apartment')],
      Room: [this.defaultFilters.includes('Room')],
      House: [this.defaultFilters.includes('House')]
    });

  }

  submit(formValue) {

    const homeTypes = Object.keys(formValue).filter(item => formValue[item]);

    this.applied.emit(homeTypes);

  }

}
