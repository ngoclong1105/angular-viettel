import { UnsubscribeService } from './service/unsubscribe.service';
import { AccountData } from './interface/account';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './core/services/account.service';
import { Account, createAccount, createParamSearch } from './core/model/account.model';
import { takeUntil } from 'rxjs/operators';
import { Accounts } from './core/data/account';
import { MatDialog } from '@angular/material/dialog';
import { DialogUpdateAccountComponent } from './dialog/dialog-update-account/dialog-update-account.component';
import { UpdateAccountService } from './service/updateAccount.service';
import { TableAccountComponent } from './component/table-account/table-account.component';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  account: Account[] = [];
  searchStr:any = '';
  totalAccount!: number;
  pagingMode = 'paging'; // mode paging or scroll
  numberOfPage = 25;
  dataUpdate!: any;
  dataAdd!: any;
  isUpdatedDone: boolean = false;
  dataInput: string = '';
  @ViewChild('tableAcc') tableAcc!: TableAccountComponent;
  today = moment().format('YYYY');

  constructor(
    private accountService: AccountService,
    private updateAccountService: UpdateAccountService,
    public dialog: MatDialog,
    private unsubscribeService: UnsubscribeService) {
    // read data from file to localstorage
    this.updateAccountService.addAccount.pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe((data: AccountData)=>{
      this.dataAdd = data;
    })
    this.updateAccountService.updateAccount.pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe((data: AccountData)=>{
      this.dataUpdate = data;
    })
    this.loadDataToLocal();
  }

  ngOnInit(): void {
    this.getAllAccount();
  }

  loadDataToLocal(): void {
    localStorage.setItem('accounts', JSON.stringify(Accounts));
  }

  getAllAccount(start?: number, pageScroll?: number): void {
    let dataPost: any;
    if (!pageScroll) {
      pageScroll = 1
    }
    if(this.searchStr == ''){
      dataPost = {
        last_name: this.searchStr,
        start: start ? start : 0,
        limit: this.pagingMode == 'paging' ? this.numberOfPage : (this.numberOfPage * pageScroll),
      }
    }
    else{
      if(this.searchStr.searchBy == 'lastname'){
        dataPost = {
          last_name: this.searchStr.value,
          start: start ? start : 0,
          limit: this.pagingMode == 'paging' ? this.numberOfPage : (this.numberOfPage * pageScroll),
        }
      }
      if(this.searchStr.searchBy == 'balance'){
        dataPost = {
          balance: Number(this.searchStr.value),
          start: start ? start : 0,
          limit: this.pagingMode == 'paging' ? this.numberOfPage : (this.numberOfPage * pageScroll),
        }
      }
      if(this.searchStr.searchBy == 'age'){
        let dateOfBirth = moment(this.searchStr.value).format('YYYY');
        dataPost = {
          age: Number(moment().format('YYYY')) - Number(dateOfBirth),
          start: start ? start : 0,
          limit: this.pagingMode == 'paging' ? this.numberOfPage : (this.numberOfPage * pageScroll),
        }
      }
    }
    this.accountService.getAccounts(createParamSearch(dataPost))
    .pipe(takeUntil(this.unsubscribeService.destroyed$))
      .subscribe((resp: any) => {
        this.totalAccount = Number(resp.total);
        this.account = resp.rows;
      }, (err: Error) => {
        this.account = [];
      });
  }

  handleSearch(e: any) {
    this.searchStr = e;
    this.getAllAccount();
    this.dataInput = e.value;
  }

  handleLoadingData(e: any) {
    if (this.pagingMode == 'scroll') {
      this.getAllAccount(undefined, e);
      return
    }
    this.getAllAccount(e, undefined);
  }

  removeAccounts(e: any) {
    let checkDelete = window.confirm('Bạn có chắc muốn xóa account không?');
    if (checkDelete) {
      e.forEach((element: string) => {
        this.accountService.deleteAccount(element).pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe(e => {
          if (e) {
            this.getAllAccount();
            this.tableAcc.resetlistCheckedAccount();
          }
        })
      });
    }
  }

  updateAccounts(e: any) {
    this.openDialogUpdate(e[0]);
  }

  openDialogUpdate(data: string) {
    let dialogRef = this.dialog.open(DialogUpdateAccountComponent, {
      data: {
        id:data,
        addAccount:false},
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe((rs:boolean) => {
      if(rs){
        this.accountService.editAccount(this.dataUpdate).pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe(rs =>{
          if(rs){
            this.getAllAccount();
            this.tableAcc.resetlistCheckedAccount();
            this.isUpdatedDone = true;
          }
        })
      }
    })
  }
  
  addAccount(){
    let dialogRef = this.dialog.open(DialogUpdateAccountComponent, {
      data: {addAccount:true},
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe((rs:boolean) => {
      if(rs){
        this.accountService.addAccount(this.dataAdd).pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe(rs =>{
          if(rs){
            this.getAllAccount();
            this.isUpdatedDone = true;
          }
        })
      }
    })
  }
}

