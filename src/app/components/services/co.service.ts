import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { CoController } from 'src/app/components/controllers/co.controller';
import { BoController } from 'src/app/components/controllers/bo.controller';
import { EditingService } from 'src/app/components/services/editing.service';
import { safeObserve } from 'src/app/app.component';
import { BoFieldForCo, BoFieldForCoF } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CompositeObject } from 'src/app/components/composite-editor/models/CompositeObject';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { CoFieldRecord, CoFieldRecordF } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { BoFieldLink, BoFieldLinkF } from 'src/app/components/composite-editor/models/BoFieldLink';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CoWidget, CoWidgetF } from 'src/app/components/composite-editor/models/CoWidget';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';
import { BoFieldForCoWIthBoId, BoFieldForCoWIthBoIdF } from 'src/app/components/composite-editor/models/BoFieldForCoWIthBoId';
import { LeaderLineDraw } from 'src/app/components/composite-editor/models/LeaderLineDraw';
import { CoChangeService } from 'src/app/components/services/co-change.service';

@Injectable({
  providedIn: 'root'
})
export class CoService {

  private boRecordsWithFieldsBehavior: BehaviorSubject<BoRecordWithFields[]> = new BehaviorSubject([]);
  public boRecordsWithFields$: Observable<BoRecordWithFields[]> = this.boRecordsWithFieldsBehavior.asObservable();

  private coFieldsSimpleBehavior: BehaviorSubject<CoFieldRecord[]> = new BehaviorSubject<CoFieldRecord[]>([
    {
      // todo nabu test
      label: 'sdfsdf',
      coFieldId: 'asdfsdfsd',
      links: [{boId: 'dsfsdf', fieldId: 'sdff'},
      ]
    } as CoFieldRecord
  ]);
  public coFieldsSimple$: Observable<CoFieldRecord[]> = this.coFieldsSimpleBehavior.asObservable();


  private coFieldsCompositeBehavior: BehaviorSubject<CoFieldRecord[]> = new BehaviorSubject<CoFieldRecord[]>([]);
  public coFieldsComposite$: Observable<CoFieldRecord[]> = this.coFieldsCompositeBehavior.asObservable();


  private coWidgetsBehavior: BehaviorSubject<CoWidget[]> = new BehaviorSubject([
    CoWidgetF.create(CoWidgetType.COMPOSITE, this.coFieldsComposite$),
    CoWidgetF.create(CoWidgetType.SIMPLE, this.coFieldsSimple$)
  ]);
  public coWidgets$: Observable<CoWidget[]> = this.coWidgetsBehavior.asObservable();

  get boRecordsWithFields(): BoRecordWithFields[] {
    return this.boRecordsWithFieldsBehavior.value;
  }

  get coFieldsSimple(): CoFieldRecord[] {
    return this.coFieldsSimpleBehavior.value;
  }

  get coFieldsComposite(): CoFieldRecord[] {
    return this.coFieldsCompositeBehavior.value;
  }

  get coWidgets(): CoWidget[] {
    return this.coWidgetsBehavior.value;
  }

  leaderLines: LeaderLineDraw[] = [];

  private _draftId = '';

  get draftId(): string {
    return this._draftId;
  }

  set draftId(value: string) {
    this._draftId = value;
  }

  private _coId = '';

  get coId(): string {
    return this._coId;
  }

  set coId(value: string) {
    this._coId = value;
  }


  constructor(private coController: CoController,
              private boController: BoController,
              private editingService: EditingService,
              private coChangeService: CoChangeService
  ) {

  }

  loads(): Observable<any> {
    return forkJoin([this.loadBoRecordsForCo(), this.loadCoFields()]);
  }

  generateFirstDraft(): Observable<string> {
    return this.editingService.businessObject$
      .pipe(
        filter(bo => !!bo),
        tap(bo => this.coId = bo.id),
        switchMap(() => this.generate()),
        mergeMap(() => this.loads())
      );
  }

  generate(): Observable<string> {
    return safeObserve(this.coController.generateDraft(this.coId)
      .pipe(
        tap(g => this.draftId = g)
      ))
      .pipe(this.coChangeService.changedSaveTap());
  }

  apply(): Observable<string> {
    return safeObserve(this.coController.applyAndRemoveDraft(this.draftId)
      .pipe(
        switchMap(() => this.generate()),
      ));
  }

  cancel(): Observable<string> {
    return safeObserve(this.coController.removeDraft(this.draftId)
      .pipe(
        switchMap(() => this.generate()),
        switchMap(() => this.loads()),
      ));
  }

  addBoToCo(boRecord: BoRecord): Observable<BoRecord> {
    this.boRecordsWithFields.push(BoRecordWithFieldsF.toBo(boRecord));
    return this.coController.addBoToCo(this.coId, this.draftId, boRecord.id)
      .pipe(
        // todo nabu test
        // tap((bo) => this.boRecordsWithFields.push(BoRecordWithFieldsF.toBo(bo)))
      )
      .pipe(this.coChangeService.changedTap());
  }

  loadBoRecordsForCo(): Observable<BoRecord[]> {
    return this.coController.loadBoRecordsForCo(this.coId, this.draftId)
      .pipe(
        map((boRecords) => boRecords.map((bo) => BoRecordWithFieldsF.toBo(bo))),
        tap((boRecords: BoRecordWithFields[]) => {
          boRecords.forEach((boRecord) => {
            const record = this.boRecordsWithFields.find((bo) => bo.id === boRecord.id);
            boRecord.fields = record?.fields;
            boRecord.isExpand = record?.isExpand;
          });
          this.boRecordsWithFieldsBehavior.next((boRecords as BoRecordWithFields[]) || []);
        })
      );
  }

  loadCoFields(): Observable<any> {
    return forkJoin([this.coController.loadCoFieldsComposite(this.coId, this.draftId), this.coController.loadCoFieldsSimple(this.coId, this.draftId)])
      .pipe(tap((fields) => {
        this.coFieldsCompositeBehavior.next(fields[0]);
        this.coFieldsSimpleBehavior.next(fields[1]);
      }));
  }

  loadBoFieldsForCo(boRecordWithFields: BoRecordWithFields): Observable<BoFieldForCo[]> {
    return of(boRecordWithFields.fields)
      .pipe(
        filter(() => !boRecordWithFields.fields),
        switchMap(() => this.coController.loadBoFieldsForCo(boRecordWithFields.id)),
        tap((boFields) => BoRecordWithFieldsF.toFields(boRecordWithFields, boFields))
      );
  }


  dropToCoGroup(event: CdkDragDrop<BoFieldForCo[]>): void {
    const coFields = [...this.coFieldsComposite, ...this.coFieldsSimple];
    const fields: BoFieldForCoWIthBoId[] = [].concat.apply([], this.boRecordsWithFields.map((bo) => bo?.fields?.map?.(field => BoFieldForCoWIthBoIdF.create(bo.id, field))).filter(Boolean) as any[]);
    const checkedUniqueFields = fields.filter((field) => field.isChecked && !coFields.some((coField) => coField.links.some((link) => link.fieldId === field.fieldId)));
    if (!checkedUniqueFields.length) {
      return;
    }
    const boFieldLinks = checkedUniqueFields.map((field) => BoFieldLinkF.create(field.boId, field.fieldId));
    this.coController.addCoFieldToSimple(this.coId, this.draftId, boFieldLinks).subscribe((coFieldRecords) => {
      this.coFieldsSimple.push(...coFieldRecords);
    });
  }

  dropToCoComposite(event: CdkDragDrop<CoFieldRecord[], CoFieldRecord[]> | CdkDragDrop<CoFieldRecord[], BoFieldForCo[]>): void {
    if (event.previousContainer.data.length === 1 && 'coFieldId' in event.previousContainer.data[0]) {
      this.dropToCoCompositeByCoField(event as CdkDragDrop<CoFieldRecord[], CoFieldRecord[]>);
      return;
    }
    this.dropToCoCompositeByBoField(event as CdkDragDrop<CoFieldRecord[], BoFieldForCo[]>);
  }

  dropToCoCompositeByBoField(event: CdkDragDrop<CoFieldRecord[], BoFieldForCo[]>): void {
    const coField = event.container.data[0] as CoFieldRecord;
    const boFields = BoFieldForCoF.flat(this.boRecordsWithFields).filter((boField) => boField.isChecked);

    if (!boFields.every((boField) => boField.type === coField.type)) {
      // todo nabu
      return;
    }


  }

  dropToCoCompositeByCoField(event: CdkDragDrop<CoFieldRecord[], CoFieldRecord[]>): void {
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

    this.coController.addCoFieldToComposite(this.coId, this.draftId, links, currentField.coFieldId)
      .pipe(switchMap(() => this.removeCoField(prevField)), take(1))
      .pipe(this.coChangeService.changedTap())
      .subscribe();

  }

  removeBo(boWithFields: BoRecordWithFields): Observable<void> {
    return this.coController.removeBoFromCo(this.coId, this.draftId, boWithFields.id)
      .pipe(
        tap(() => {
            const index = this.boRecordsWithFields.findIndex(bo => bo.id === boWithFields.id);
            this.boRecordsWithFields.splice(index, 1);
          }
        ))
      .pipe(this.coChangeService.changedTap());

  }

  removeCoField(coField: CoFieldRecord): Observable<void> {
    return this.coController.removeCoField(this.coId, this.draftId, coField.coFieldId)
      .pipe(tap(() => {
        CoFieldRecordF.remove(coField, this.coFieldsSimple);
        CoFieldRecordF.remove(coField, this.coFieldsComposite);
        this.coChangeService.removeCoFieldSubject.next(coField.coFieldId);
      }))
      .pipe(this.coChangeService.changedTap());
  }

  removeLink(coField: CoFieldRecord, boFieldLink: BoFieldLink | undefined): Observable<void> {
    BoFieldLinkF.remove(boFieldLink.fieldId, coField.links);
    return this.coController.removeBoFieldLink(this.coId, this.draftId, coField.coFieldId, boFieldLink)
      .pipe(this.coChangeService.changedTap());

  }

  changeCoFieldLabel(coFieldId: string, label: string): Observable<void> {
    return this.coController.changeCoFieldLabel(this.coId, this.draftId, coFieldId, label)
      .pipe(this.coChangeService.changedTap());

  }
}
