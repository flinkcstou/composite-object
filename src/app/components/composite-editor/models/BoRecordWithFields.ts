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

    const fields = [];
    for (const a of 'sdfdsfsd') {

      const boFieldForCo: BoFieldForCo = {
        fieldId: CoWidget.rndId(),
        label: CoWidget.rndId(),
        type: 'ASD'
      } as BoFieldForCo;
      fields.push(boFieldForCo);
    }

    const boRecordWithFields = new BoRecordWithFields(boRecord);
    boRecordWithFields.fields = fields;
    return boRecordWithFields as BoRecordWithFields;
  },
  toFields(boRecordWithFields: BoRecordWithFields, boFieldsForCo: BoFieldForCo[]): BoRecordWithFields {
    boRecordWithFields.fields = boFieldsForCo;
    return boRecordWithFields;
  }
};

