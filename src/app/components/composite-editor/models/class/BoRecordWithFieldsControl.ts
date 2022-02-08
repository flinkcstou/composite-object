import { Subject } from 'rxjs';

export class BoRecordWithFieldsControl<T> {
  toggleSubject: Subject<any> = new Subject<any>();

  constructor(private records: T) {
  }
}
