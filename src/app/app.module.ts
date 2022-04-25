import { DialogUpdateAccountComponent } from './dialog/dialog-update-account/dialog-update-account.component';
import { LoadingService } from './core/services/loading.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { fakeBackendProvider } from './core/services/fake-backend';
import { AccountService } from './core/services/account.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TableAccountComponent } from './component/table-account/table-account.component';
import { ScrollTrackerDirective } from './directive/scroll-tracker.directive';
import { SearchAccountComponent } from './component/search-account/search-account.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
  ],
  declarations: [
    AppComponent,
    TableAccountComponent,
    DialogUpdateAccountComponent,
    ScrollTrackerDirective,
    SearchAccountComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    // provider used to create fake backend,
    AccountService,
    fakeBackendProvider,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingService, multi: true }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
