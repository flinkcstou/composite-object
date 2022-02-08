import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';
import { Observable } from 'rxjs';

export class CoWidget implements StyleField {
  id: string;

  hover: boolean;
  isChecked: boolean;
  isExpand: boolean;
  isReplacement: boolean;
  linkLeaderLine: boolean;

  constructor(public coWidgetType: CoWidgetType, public  coFields$: Observable<CoFieldRecord[]>) {
    this.id = CoWidget.rndId();
  }

  private static rndId(): string {
    return Math.floor(Math.random() * 10000) + '';
  }
}

export const CoWidgetF = {
  create(coWidgetType: CoWidgetType, coFields$: Observable<CoFieldRecord[]>): CoWidget {
    return new CoWidget(coWidgetType, coFields$);
  }
};
