import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';

export interface BoFieldForCoWIthBoId extends BoFieldForCo {
  boId: string;
}

export const BoFieldForCoWIthBoIdF = {
  create(boId: string, boFieldForCo: BoFieldForCo): BoFieldForCoWIthBoId {
    return {boId, ...boFieldForCo};
  }
};



