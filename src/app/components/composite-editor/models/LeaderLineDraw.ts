import { Subject } from 'rxjs';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';

export class LeaderLineDraw {

  id: string;
  removeSubject: Subject<string> = new Subject();
  changeColorSubject: Subject<{ color: string, fieldId: string }> = new Subject();


  constructor(public field: CoFieldRecord) {
    this.id = LeaderLineDraw.rndId();
  }


  private static rndId(): string {
    return Math.floor(Math.random() * 10000) + '';
  }

  public static find(id: string, lines: LeaderLineDraw[]): LeaderLineDraw {
    return lines.find((line) => line.id === id);
  }

  public static findIndex(id: string, lines: LeaderLineDraw[]): number {
    return lines.findIndex((line) => line.id === id);
  }

  public static findByFieldId(id: string, lines: LeaderLineDraw[]): LeaderLineDraw {
    return lines.find((leaderLine) => leaderLine.field.linkLeaderLine && leaderLine.field.links.some((link) => link.fieldId === id));
  }

  public static removeById(id: string, lines: LeaderLineDraw[]): void {
    if (!id) {
      return;
    }
    lines.splice(LeaderLineDraw.findIndex(id, lines), 1);
  }

}

export const LeaderLineDrawF = {
  create(field: CoFieldRecord): LeaderLineDraw {
    return new LeaderLineDraw(field);
  }
};
