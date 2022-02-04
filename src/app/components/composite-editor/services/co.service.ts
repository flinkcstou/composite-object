import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { loadBoFieldIds, loadBoRecordsForDrag } from 'src/app/components/data/load';
import { BoField } from 'src/app/components/composite-editor/models/BoField';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoService {

  boItems: BoRecord[] = [];
  tabGroupFields: BoField[] = [];

  constructor() {
  }

  loadBoRecords(): void {
    this.boItems = loadBoRecordsForDrag;
  }

  loadBoFields(id: string): Observable<BoField[]> {
    // @ts-ignore
    return of(loadBoFieldIds[id]).pipe(
      tap((l) => this.tabGroupFields.push(...l.filter(value => value?.tabs?.length)))
    );
  }
}
