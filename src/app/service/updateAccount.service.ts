import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AccountData } from '../interface/account';

@Injectable({
  providedIn: 'root'
})
export class UpdateAccountService {
  updateAccount = new Subject<AccountData>();
  addAccount = new Subject<AccountData>();
  updateAccountDone = new Subject<boolean>();
  constructor() { }
}
