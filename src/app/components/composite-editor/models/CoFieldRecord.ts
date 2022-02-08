import { BoFieldLink } from 'src/app/components/composite-editor/models/BoFieldLink';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';

export interface CoFieldRecord extends StyleField {

  coFieldId: string;

  label: string;
  type: any; // todo nabu composite-object

  links: BoFieldLink[];

}

export const CoFieldRecordF = {

  findIndex(coField: CoFieldRecord, coFields: CoFieldRecord[]): number {
    return coFields.findIndex((field) => field.coFieldId === coField.coFieldId);
  },
  remove(coField: CoFieldRecord, coFields: CoFieldRecord[]): void {
    const index = CoFieldRecordF.findIndex(coField, coFields);
    if (index !== -1) {
      coFields.splice(index, 1);
    }
  }
};
