import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { CompositeObject } from 'src/app/components/composite-editor/models/CompositeObject';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CoController } from 'src/app/components/controllers/co.controller';
import { BoController } from 'src/app/components/controllers/bo.controller';
import { safeObserve } from 'src/app/app.component';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditingService {

  // @ts-ignore
  private readonly boRecordsSubject = new BehaviorSubject<BoRecord[]>(undefined);
  public readonly boRecords$: Observable<BoRecord[]> = this.boRecordsSubject.asObservable();

  // @ts-ignore
  public readonly businessObjectSubject: BehaviorSubject<CompositeObject> = new BehaviorSubject(undefined);
  public readonly businessObject$: Observable<CompositeObject> = this.businessObjectSubject.asObservable();

  constructor(private coController: CoController,
              private boController: BoController) {
  }

  get businessObject(): CompositeObject {
    return this.businessObjectSubject.value;
  }

  get boRecords(): BoRecord[] {
    return this.boRecordsSubject.value;
  }


  loadBoRecords(id: string): Observable<string> {
    return safeObserve(this.boController.loadBoRecordsForDrag()).pipe(
      tap(bo => this.boRecordsSubject.next(bo)),
      switchMap(() => of(id)),
    );
  }

  loadBusinessObject(businessObjectId: string): Observable<void> {
    this.businessObjectSubject.next({id: businessObjectId});
    return of();
  }

}
