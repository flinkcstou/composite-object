import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { BoFieldForCoWIthBoIdF } from 'src/app/components/composite-editor/models/BoFieldForCoWIthBoId';

export interface BoFieldForCo extends StyleField {
  fieldId: string;
  label: string;
  type: any;
  code: string;
  nativeFieldType: any;
  widgetType: any;
  tabId: string;
  tabs: any[];
}

export const BoFieldForCoF = {

  flat(boRecordWithFields: BoRecordWithFields[]): BoFieldForCo[] {
    return [].concat.apply([], boRecordWithFields.map((bo) => bo.fields).filter(Boolean));
  }

};


