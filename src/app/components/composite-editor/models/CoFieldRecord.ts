import { BoFieldLink } from 'src/app/components/composite-editor/models/BoFieldLink';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';

export interface CoFieldRecord extends StyleField {

  coFieldId: string;

  label: string;
  type: any; // todo nabu composite-object

  links: BoFieldLink[];

}
