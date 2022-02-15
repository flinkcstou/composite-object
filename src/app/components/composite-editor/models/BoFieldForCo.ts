import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';

export interface BoFieldForCo extends StyleField {
  boId: string;

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
  setBoId(boId: string, boFields: BoFieldForCo[]): void {
    boFields.forEach((boFIeld) => boFIeld.boId = boId);
  },

  flat(boRecordWithFields: BoRecordWithFields[]): BoFieldForCo[] {
    return [].concat.apply([], boRecordWithFields.map((bo) => bo.fields).filter(Boolean));
  }

};


