import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-home-search',
  templateUrl: './home-search.component.html'
})
export class HomeSearchComponent implements OnInit, OnChanges {
  @Input() defaultSearch = '';
  @Output() applied = new EventEmitter<string>();

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      search: [this.defaultSearch]
    });

    this.form.get('search').valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.applied.emit(value || '');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.defaultSearch) {
      this.form.patchValue(
        { search: this.defaultSearch },
        { emitEvent: false }
      );
    }
  }
}
