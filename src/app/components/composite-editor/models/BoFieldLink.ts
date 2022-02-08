export interface BoFieldLink {

  boId: string;
  fieldId: string;

}

export const BoFieldLinkF = {
  create(boId: string, fieldId: string): BoFieldLink {
    return {boId, fieldId};
  },
  findIndex(fieldId: string, links: BoFieldLink[]): number {
    return links.findIndex((link) => link.fieldId === fieldId);
  },
  find(fieldId: string, links: BoFieldLink[]): BoFieldLink {
    const index = BoFieldLinkF.findIndex(fieldId, links);
    return links[index];
  },
  remove(fieldId: string, links: BoFieldLink[]): void {
    const index = BoFieldLinkF.findIndex(fieldId, links);
    if (index !== -1) {
      links.splice(index, 1);
    }
  }
};
