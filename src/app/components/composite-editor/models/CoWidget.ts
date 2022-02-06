import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';

export interface CoWidget extends StyleField {
  coWidgetType: CoWidgetType;
  coFields: CoFieldRecord[];
}

export const CoWidgetF = {
  create(coWidgetType: CoWidgetType, coFields: CoFieldRecord[]): CoWidget {
    return {coWidgetType, coFields} as CoWidget;
  }
};
