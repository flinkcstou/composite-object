import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, ObservedValuesFromArray, of, Subject } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { CoController } from 'src/app/components/controllers/co.controller';
import { BoController } from 'src/app/components/controllers/bo.controller';
import { EditingService } from 'src/app/components/services/editing.service';
import { safeObserve } from 'src/app/app.component';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CompositeObject } from 'src/app/components/composite-editor/models/CompositeObject';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { CoFieldRecord, CoFieldRecordF } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { BoFieldLink, BoFieldLinkF } from 'src/app/components/composite-editor/models/BoFieldLink';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CoWidgetF } from 'src/app/components/composite-editor/models/CoWidget';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';
import { BoFieldForCoWIthBoId, BoFieldForCoWIthBoIdF } from 'src/app/components/composite-editor/models/BoFieldForCoWIthBoId';
import { LeaderLineDraw } from 'src/app/components/composite-editor/models/LeaderLineDraw';
import { CoChangeService } from 'src/app/components/services/co-change.service';

@Injectable({
  providedIn: 'root'
})
export class CoService {

  boRecordsWithFields: BoRecordWithFields[] = [];


  coFieldsSimple: CoFieldRecord[] = [];
  coFieldsComposite: CoFieldRecord[] = [];

  coWidgets: any[] = [
    CoWidgetF.create(CoWidgetType.COMPOSITE, this.coFieldsComposite),
    CoWidgetF.create(CoWidgetType.SIMPLE, this.coFieldsSimple)
  ];

  leaderLines: LeaderLineDraw[] = [];

  public changedSubject: Subject<void> = new Subject<void>();
  public changedLoadedSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);


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
              private editingService: EditingService,
              private coChangeService: CoChangeService) {

    this.changedSubject.pipe(
      mergeMap(() => this.loadBoRecordsForCo())
    ).subscribe(() => {
      this.changedLoadedSubject.next();
    });
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
        tap((boRecords) => this.boRecordsWithFields = (boRecords as BoRecordWithFields[]) || [])
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


  dropToCoGroup(event: CdkDragDrop<BoFieldForCo[]>) {

    const coFields = [...this.coFieldsComposite, ...this.coFieldsSimple];
    const fields: BoFieldForCoWIthBoId[] = [].concat.apply([], this.boRecordsWithFields.map((bo) => bo.fields.map(field => BoFieldForCoWIthBoIdF.create(bo.id, field))) as any[]);
    const checkedUniqueFields = fields.filter((field) => field.isChecked && !coFields.some((coField) => coField.links.some((link) => link.fieldId === field.fieldId)));
    if (!checkedUniqueFields.length) {
      return;
    }
    const boFieldLinks = checkedUniqueFields.map((field) => BoFieldLinkF.create(field.boId, field.fieldId));
    this.coController.addCoFieldToSimple(this.bo.id, this.draftId, boFieldLinks).subscribe((coFieldRecords) => {
      this.coFieldsSimple.push(...coFieldRecords);
    });
  }

  dropToCoComposite(event: CdkDragDrop<CoFieldRecord[]> | CdkDragDrop<BoFieldForCo[]>): void {
    if (event.previousContainer.data.length === 1 && 'coFieldId' in event.previousContainer.data[0]) {
      this.dropToCoCompositeByCoField(event as CdkDragDrop<CoFieldRecord[]>);
    }
    this.dropToCoCompositeByBoField(event as CdkDragDrop<BoFieldForCo[]>);
  }

  dropToCoCompositeByBoField(event: CdkDragDrop<BoFieldForCo[]>): void {

  }

  dropToCoCompositeByCoField(event: CdkDragDrop<CoFieldRecord[]>): void {
    const prevField = event.previousContainer.data[0];
    const currentField = event.container.data[0];
    if (prevField.type !== currentField.type) {
      return;
    }
    if (prevField.coFieldId === currentField.coFieldId) {
      return;
    }
    const links = [...prevField.links, ...currentField.links];

    this.coFieldsComposite.push(currentField);
    currentField.links = links;

    CoFieldRecordF.remove(prevField, this.coFieldsSimple);
    CoFieldRecordF.remove(currentField, this.coFieldsSimple);
    this.coChangeService.removeCoFieldSubject.next(prevField.coFieldId);

    this.coController.addCoFieldToComposite(this.bo.id, this.draftId, links, currentField.coFieldId)
      .pipe(switchMap(() => this.removeCoField(prevField)), take(1)).subscribe();

  }

  removeBo(boWithFields: BoRecordWithFields): Observable<void> {
    return this.coController.removeBoFromCo(this.bo.id, this.draftId, boWithFields.id)
      .pipe(
        tap(() => {
            const index = this.boRecordsWithFields.findIndex(bo => bo.id === boWithFields.id);
            this.boRecordsWithFields.splice(index, 1);
          }
        ));
  }

  removeCoField(coField: CoFieldRecord): Observable<void> {
    return this.coController.removeCoField(this.bo.id, this.draftId, coField.coFieldId)
      .pipe(tap(() => {
        CoFieldRecordF.remove(coField, this.coFieldsSimple);
        CoFieldRecordF.remove(coField, this.coFieldsComposite);
        this.coChangeService.removeCoFieldSubject.next(coField.coFieldId);
      }));
  }

  removeLink(coField: CoFieldRecord, boFieldLink: BoFieldLink | undefined): Observable<void> {
    BoFieldLinkF.remove(boFieldLink.fieldId, coField.links);
    return this.coController.removeBoFieldLink(this.bo.id, this.draftId, coField.coFieldId, boFieldLink);
  }
}
