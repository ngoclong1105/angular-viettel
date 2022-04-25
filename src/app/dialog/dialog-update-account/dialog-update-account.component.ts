import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';
import { UpdateAccountService } from 'src/app/service/updateAccount.service';
import { AccountData } from 'src/app/interface/account';
import { ErrorForm } from 'src/app/const/errorForm';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from 'src/app/service/unsubscribe.service';


export function forbiddenGender(c: AbstractControl) {
  const listGender = ['F', 'M'];
  return (!listGender.includes(c.value)) ? {
    invalidGender: true
  } : null
}

export function balanceValidate(c: AbstractControl) {
  return c.value >= 0 ? null : {
    invalidGender: true
  }
}

@Component({
  selector: 'app-dialog-update-account',
  templateUrl: './dialog-update-account.component.html',
  styleUrls: ['./dialog-update-account.component.scss']
})
export class DialogUpdateAccountComponent implements OnInit {
  accountForm!: FormGroup;
  formatField = ErrorForm.formError;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService,
    private fb: FormBuilder,
    private updateAccountService: UpdateAccountService,
    private unsubscribeService: UnsubscribeService) { }
  ngOnInit(): void {
    this.createForm();
    if(!this.data.addAccount){
      this.getAccountById(this.data.id); // case is update form
    }
  }
  createForm() {
    this.accountForm = this.fb.group({
      id: this.fb.control(''),
      lastname: this.fb.control('', [Validators.required]),
      age: this.fb.control('', [Validators.required,Validators.pattern('^([1-9][0-9]*)$')]),
      balance: this.fb.control('', [Validators.required,balanceValidate]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      account_number: this.fb.control('', [Validators.required]),
      address: this.fb.control('', [Validators.required]),
      city: this.fb.control('', [Validators.required]),
      employer: this.fb.control('', [Validators.required]),
      firstname: this.fb.control('', [Validators.required]),
      gender: this.fb.control('', [Validators.required,forbiddenGender,Validators.max(1)]),
      state: this.fb.control('', [Validators.required])
    });
  }

  getAccountById(data: string) {
    this.accountService.getAccountById(data).pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe((rs: any) => {
      this.accountForm.patchValue({
        id: rs[0]._id,
        lastname: rs[0].lastname,
        age: rs[0].age,
        balance: rs[0].balance,
        email: rs[0].email,
        account_number: rs[0].account_number,
        address: rs[0].address,
        city: rs[0].city,
        employer: rs[0].employer,
        firstname: rs[0].firstname,
        gender: rs[0].gender,
        state: rs[0].state,
      })
    })
  }

  updateAccount(){
    const formValue = this.accountForm.value;
    const data: AccountData = {
      _id: formValue.id,
      lastname: formValue.lastname,
      age: formValue.age,
      balance: formValue.balance,
      email: formValue.email,
      account_number: formValue.account_number,
      address: formValue.address,
      city: formValue.city,
      employer: formValue.employer,
      firstname: formValue.firstname,
      gender: formValue.gender,
      state: formValue.state,
    }
    if(this.data.addAccount){
      this.updateAccountService.addAccount.next(data);
    }
    else{
      this.updateAccountService.updateAccount.next(data);
    }
  }

}
