export interface BoFieldLink {

  boId: string;
  fieldId: string;

}

export const BoFieldLinkF = {
  create(boId: string, fieldId: string): BoFieldLink {
    return {boId, fieldId};
  }
};
