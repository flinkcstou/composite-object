import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';

export interface StyleField {
  isChecked: boolean;
  isExpand: boolean;
  hover: boolean;
  isReplacement: boolean;
  linkLeaderLine: boolean;
}

export const StyleFieldF = {
  clearCheck(boField: BoRecordWithFields): void {
    if (boField.isExpand && boField?.fields?.length) {
      boField.fields.forEach(value => value.isChecked = false);
    }
  }
};
