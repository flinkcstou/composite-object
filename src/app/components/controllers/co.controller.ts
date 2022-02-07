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

  removeBoFromCo(coId: string, draftId: string, boId: string): Observable<void> {
    return this.http.post<void>('/remove-bo-from-co', {coId, draftId, boId})
      .pipe(map(response => response.body)) as Observable<void>;
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
    return this.http.post<CoFieldRecord[]>('/add-co-field-to-simple', {coId, draftId, boFieldLinks})
      .pipe(map(response => response.body)) as Observable<CoFieldRecord[]>;
  }

  addCoFieldToComposite(coId: string, draftId: string,
                        boFieldLinks: BoFieldLink[], coFieldId: string): Observable<CoFieldRecord> {
    return this.http.post<CoFieldRecord>('/add-co-field-to-composite', {coId, draftId, boFieldLinks, coFieldId})
      .pipe(map(response => response.body)) as Observable<CoFieldRecord>;
  }

  removeCoField(coId: string, draftId: string, coFieldId: string): Observable<void> {

    return this.http.post<void>('/remove-co-field', {coId, draftId, coFieldId})
      .pipe(map(response => response.body)) as Observable<void>;
  }

  removeBoFieldLink(coId: string, draftId: string,
                    coFieldId: string, boFieldLink: BoFieldLink | undefined): Observable<void> {
    return this.http.post<void>('/remove-bo-field-link', {coId, draftId, coFieldId, boFieldLink})
      .pipe(map(response => response.body)) as Observable<void>;
  }

}
