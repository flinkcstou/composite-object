import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CoController } from 'src/app/components/controllers/co.controller';
import { BoController } from 'src/app/components/controllers/bo.controller';
import { EditingService } from 'src/app/components/services/editing.service';
import { safeObserve } from 'src/app/app.component';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CompositeObject } from 'src/app/components/composite-editor/models/CompositeObject';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';

@Injectable({
  providedIn: 'root'
})
export class CoService {

  boRecordsWithFields: BoRecordWithFields[] = [];

  public changedSubject: Subject<void> = new Subject<void>();


  private _draftId = '';

  get draftId(): string {
    return this._draftId;
  }

  set draftId(value: string) {
    this._draftId = value;
  }

  private bo: CompositeObject = {} as CompositeObject;


  constructor(private coController: CoController,
              private boController: BoController,
              private editingService: EditingService) {

    // this.changedSubject.pipe(
    //   mergeMap(() => this.loadBoRecordsForCo())
    // ).subscribe(() => {
    // });
  }

  generateFirstDraft(): Observable<string> {
    return this.editingService.businessObject$
      .pipe(
        filter(bo => !!bo),
        tap(bo => this.bo = bo),
        switchMap(() => this.generate())
      );
  }

  generate(): Observable<string> {
    return safeObserve(this.coController.generateDraft(this.bo.id)
      .pipe(
        tap(g => this.draftId = g),
        tap(() => this.changedSubject.next())
      ));
  }

  apply(): Observable<string> {
    return safeObserve(this.coController.applyAndRemoveDraft(this.draftId)
      .pipe(
        switchMap(() => this.generate()),
      ));
  }

  addBoToCo(boId: string): Observable<BoRecord> {
    return this.coController.addBoToCo(this.bo.id, this.draftId, boId)
      .pipe(
        tap((bo) =>
          this.boRecordsWithFields.push(BoRecordWithFieldsF.toBo(bo)))
      );
  }

  loadBoRecordsForCo(): Observable<BoRecord[]> {
    return this.coController.loadBoRecordsForCo(this.bo.id, this.draftId)
      .pipe(
        tap((boRecords) => this.boRecordsWithFields = (boRecords as BoRecordWithFields[]))
      );
  }

  loadBoFieldsForCo(boRecordWithFields: BoRecordWithFields): Observable<BoFieldForCo[]> {
    return of(boRecordWithFields.fields)
      .pipe(
        filter(() => !boRecordWithFields.fields),
        switchMap(() => this.coController.loadBoFieldsForCo(boRecordWithFields.id)),
        tap((boFields) => BoRecordWithFieldsF.toFields(boRecordWithFields, boFields))
      );
  }


}
