import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements HttpInterceptor {

  constructor(private _spinner: NgxSpinnerService) { }
  private _totalRequests: number = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this._totalRequests++;
    this._spinner.show();
    return next.handle(req).pipe(
      finalize(() => {
        this._totalRequests--;
        if (this._totalRequests === 0) {
          this._spinner.hide();
        }
      })
    );
  }
}
