import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { Subject } from 'rxjs';
import { CoWidget } from 'src/app/components/composite-editor/models/CoWidget';

export class BoRecordWithFields implements BoRecord, StyleField {
  fields: BoFieldForCo[];
  hover: boolean;
  isChecked: boolean;
  isExpand: boolean;
  isReplacement: boolean;
  linkLeaderLine: boolean;
  id: string;
  name: string;

  toggleSubject: Subject<string> = new Subject<string>();
  removeSubject: Subject<string> = new Subject<string>();

  constructor({id, name}: BoRecord) {
    this.id = id;
    this.name = name;

  }

}

export const BoRecordWithFieldsF = {
  toBo(boRecord: BoRecord): BoRecordWithFields {
    return new BoRecordWithFields(boRecord);
  },
  toFields(boRecordWithFields: BoRecordWithFields, boFieldsForCo: BoFieldForCo[]): BoRecordWithFields {
    boRecordWithFields.fields = boFieldsForCo;
    return boRecordWithFields;
  }
};

