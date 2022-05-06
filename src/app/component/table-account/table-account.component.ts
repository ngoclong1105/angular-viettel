import { Account } from '../../core/model/account.model';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { Component, Input, ViewChild, OnInit, SimpleChanges, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountData } from 'src/app/interface/account';
import { UnsubscribeService } from 'src/app/service/unsubscribe.service';


@Component({
  selector: 'app-table-account',
  templateUrl: './table-account.component.html',
  styleUrls: ['./table-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableAccountComponent implements OnInit {
  @Input() rows: Account[] = [];
  @Input() totalRows!: number;
  @Input() pagingMode!: string;
  @Input() isUpdatedDone!: boolean;
  @Input() dataInput!: string;

  @Output() searchByInput = new EventEmitter();
  @Output() isLoaded = new EventEmitter();
  @Output() removeAccounts = new EventEmitter();
  @Output() updateAccounts = new EventEmitter();
  @Output() addAccounts = new EventEmitter();

  displayedColumns: string[] = ['_id', 'firstname', 'lastname', 'age' , 'gender', 'balance','email','account_number','address','city','employer','state'];
  dataSource!: MatTableDataSource<AccountData>;
  searchControl = new FormControl();
  scrollCount = 1;
  listCheckedAccount: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private unsubscribeService: UnsubscribeService) {
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.rows && (!_.isEqual(_.map(changes.rows.currentValue, '_id'), _.map(changes.rows.previousValue, '_id')) || this.isUpdatedDone)) {
      this.updateData(this.rows);
    }
  }

  updateData(data: any) {
    this.dataSource = new MatTableDataSource(data);
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.pagingMode == 'paging') {
      this.handleOnChangePage();
    }
  }

  handleOnChangePage() {
    this.paginator.page.pipe(takeUntil(this.unsubscribeService.destroyed$)).subscribe((rs: any) => {
      this.isLoaded.emit(Number(25*rs.pageIndex))
    });
  }

  onScrollingFinished() {
    if (this.pagingMode == 'scroll') {
      this.scrollCount = this.scrollCount + 1
      this.isLoaded.emit(this.scrollCount)
    }
  }

  checkedAccount(e: any, id: string) {
    if (e.target.checked) {
      this.listCheckedAccount.push(id);
    }
    else {
      _.remove(this.listCheckedAccount, function (n) {
        return n == id;
      });
    }
  }

  resetlistCheckedAccount(){
    this.listCheckedAccount = [];
  }

  updateAccount() {
    this.updateAccounts.emit(this.listCheckedAccount);
  }

  removeAccount() {
    this.removeAccounts.emit(this.listCheckedAccount);
  }

  addAccount(){
    this.addAccounts.emit();
  }
}
