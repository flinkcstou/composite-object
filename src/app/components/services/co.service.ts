import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { concatMap, filter, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CoController } from 'src/app/components/controllers/co.controller';
import { BoController } from 'src/app/components/controllers/bo.controller';
import { EditingService } from 'src/app/components/services/editing.service';
import { safeObserve } from 'src/app/app.component';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CompositeObject } from 'src/app/components/composite-editor/models/CompositeObject';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { BoFieldLink, BoFieldLinkF } from 'src/app/components/composite-editor/models/BoFieldLink';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CoWidgetF } from 'src/app/components/composite-editor/models/CoWidget';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';
import { BoFieldForCoWIthBoId, BoFieldForCoWIthBoIdF } from 'src/app/components/composite-editor/models/BoFieldForCoWIthBoId';
import { LeaderLineDraw } from 'src/app/components/composite-editor/models/LeaderLineDraw';

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
  leaderLineSubject: Subject<boolean> = new Subject();

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

    console.error(JSON.parse(JSON.stringify(prevField)));
    console.error(JSON.parse(JSON.stringify(currentField)));
    this.coFieldsSimple.splice(this.coFieldsSimple.findIndex((field) => field.coFieldId === prevField.coFieldId), 1);
    this.coFieldsSimple.splice(this.coFieldsSimple.findIndex((field) => field.coFieldId === currentField.coFieldId), 1);
    this.coController.addCoFieldToComposite(this.bo.id, this.draftId, links, currentField.coFieldId)
      .pipe(
        tap((coField) => {
          const currentCoField = this.coFieldsComposite.find((c) => c.coFieldId === coField.coFieldId);
          if (currentCoField) {
            currentCoField.links = coField.links;
            return;
          }
          this.coFieldsComposite.push(coField);
        }),
        concatMap(() => forkJoin([this.coController.removeCoField(this.bo.id, this.draftId, prevField.coFieldId), this.coController.removeCoField(this.bo.id, this.draftId, currentField.coFieldId)]))
      )
      .subscribe();

  }

  removeBo(boWithFields: BoRecordWithFields): void {
    this.coController.removeBoFromCo(this.bo.id, this.draftId, boWithFields.id).subscribe(() => {
      const index = this.boRecordsWithFields.findIndex(bo => bo.id === boWithFields.id);
      this.boRecordsWithFields.splice(index, 1);
    });

  }

  removeCoField(coFieldId: string): void {
    this.coController.removeCoField(this.bo.id, this.draftId, coFieldId).subscribe();
  }

  removeLink(coFieldId: string, boFieldLink: BoFieldLink | undefined): void {
    this.coController.removeBoFieldLink(this.bo.id, this.draftId, coFieldId, boFieldLink).subscribe();
  }
}
