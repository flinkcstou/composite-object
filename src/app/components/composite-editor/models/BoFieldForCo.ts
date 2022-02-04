import { StyleField } from 'src/app/components/composite-editor/models/StyleField';

export interface BoFieldForCo extends StyleField {
  fieldId: string;
  label: string;
  type: any;
  nativeFieldType: any;
  widgetType: any;
  tabId: string;
  tabs: any[];
}


