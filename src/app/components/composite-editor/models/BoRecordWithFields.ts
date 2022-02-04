import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoFieldView } from 'src/app/components/composite-editor/models/BoFieldView';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';

export interface BoRecordWithFields extends BoRecord, StyleField {
  fields: BoFieldView[];
}

export const BoRecordWithFieldsF = {
  toBoWithFields(boRecord: BoRecord, fields: BoFieldView[]): BoRecordWithFields {
    return {...boRecord, fields} as BoRecordWithFields;
  }
};

