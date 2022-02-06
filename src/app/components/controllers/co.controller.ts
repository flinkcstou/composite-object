import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from 'src/app/components/services/lib/http.service';
import { map } from 'rxjs/operators';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { BoFieldLink } from 'src/app/components/composite-editor/models/BoFieldLink';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';

@Injectable({
  providedIn: 'root'
})
export class CoController {


  constructor(private http: HttpService) {
    this.http = http.setControllerPrefix('co');
    this.setToken('$koI~8c8jl6po22to-vhaBvA3cehxVDcVl4');
  }

  setToken(token: string): void {
    this.http.token = token;
  }

  addBoToCo(coId: string, draftId: string, boId: string): Observable<BoRecord> {
    return this.http.post<BoRecord>('/add-bo-to-co', {coId, draftId, boId})
      .pipe(map(response => response.body)) as Observable<BoRecord>;
  }

  loadBoRecordsForCo(coId: string, draftId: string): Observable<BoRecord[]> {
    return this.http.post<BoRecord[]>('/load-bo-records-for-co', {coId, draftId})
      .pipe(map(response => response.body)) as Observable<BoRecord[]>;
  }

  loadBoFieldsForCo(boId: string): Observable<BoFieldForCo[]> {
    return this.http.post<BoFieldForCo[]>('/load-bo-fields-for-co', {boId})
      .pipe(map(response => response.body)) as Observable<BoFieldForCo[]>;
  }

  generateDraft(coId: string): Observable<string> {
    return this.http.post<string>('/generate-draft', {coId})
      .pipe(map(response => response.body)) as Observable<string>;
  }

  applyAndRemoveDraft(draftId: string): Observable<void> {
    return this.http.post<void>('/apply-and-remove-draft', {draftId})
      .pipe(map(response => response.body)) as Observable<void>;
  }

  removeDraft(draftId: string): Observable<void> {
    return this.http.post<void>('/remove-draft', {draftId})
      .pipe(map(response => response.body)) as Observable<void>;
  }

  addCoFieldToSimple(coId: string, draftId: string, boFieldLinks: BoFieldLink[]): Observable<CoFieldRecord[]> {

    // todo nabu
    const fields: CoFieldRecord[] = [];
    boFieldLinks.forEach((boField) => {
      const coField: CoFieldRecord = {
        coFieldId: 'sdfsdfsdfsdf' + boField.fieldId,
        type: 'dafdsfds',
        links: [boField],
        label: boField.fieldId
      } as CoFieldRecord;
      fields.push(coField);
    });

    return of(fields);
    return this.http.post<CoFieldRecord[]>('/add-co-field-to-simple', {coId, draftId, boFieldLinks})
      .pipe(map(response => response.body)) as Observable<CoFieldRecord[]>;
  }

}
