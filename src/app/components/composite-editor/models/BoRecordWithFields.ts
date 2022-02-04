import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';

export interface BoRecordWithFields extends BoRecord, StyleField {
  fields: BoFieldForCo[];
}

export const BoRecordWithFieldsF = {
  toBo(boRecord: BoRecord): BoRecordWithFields {
    return {...boRecord} as BoRecordWithFields;
  },
  toFields(boRecordWithFields: BoRecordWithFields, boFieldsForCo: BoFieldForCo[]): BoRecordWithFields {
    boRecordWithFields.fields = boFieldsForCo;
    return boRecordWithFields;
  }
};

