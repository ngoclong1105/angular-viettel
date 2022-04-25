import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ErrorForm } from 'src/app/const/errorForm';
import { UnsubscribeService } from 'src/app/service/unsubscribe.service';

export function balanceValidate(c: AbstractControl) {
  return c.value >= 0 ? null : {
    invalidGender: true
  }
}
@Component({
  selector: 'app-search-account',
  templateUrl: './search-account.component.html',
  styleUrls: ['./search-account.component.scss']
})
export class SearchAccountComponent implements OnInit {
  @Output() searchByInput = new EventEmitter();
  searchBy!:string;
  formatField = ErrorForm.balanceError;

  searchControl = new FormControl();

  constructor(private unsubscribeService: UnsubscribeService) { }

  ngOnInit() {
    this.search();
  }
  search() {
    this.searchControl.valueChanges.pipe(debounceTime(500)).pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe(value => {
      if(this.searchControl.status == "VALID"){
        this.searchByInput.emit({
          searchBy: this.searchBy,
          value: value
        });
      }
    });
  }
  customSearch(e:any){
    this.searchControl.reset();
    if(e == 'balance'){
      this.searchControl.clearValidators();
      this.searchControl.setValidators([balanceValidate])
    }
    this.searchControl.clearValidators();
    this.searchBy = e;
  }
}
