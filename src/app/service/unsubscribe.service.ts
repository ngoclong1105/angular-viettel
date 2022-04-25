import { Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class UnsubscribeService implements OnDestroy {
    public destroyed$ = new Subject<void>();
    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
