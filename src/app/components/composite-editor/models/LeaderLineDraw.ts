import { Subject } from 'rxjs';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';

export class LeaderLineDraw {

  removeSubject: Subject<string> = new Subject();
  changeColorSubject: Subject<string> = new Subject();


  constructor(public field: CoFieldRecord) {

  }

}

export const LeaderLineDrawF = {
  create(field: CoFieldRecord): LeaderLineDraw {
    return new LeaderLineDraw(field);
  }
};
