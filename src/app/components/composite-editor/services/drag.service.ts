import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CoAttributeType } from 'src/app/components/composite-editor/models/CoAttributeType';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  public readonly boAttrItemsDrag = 'bo-attr-items-drag';
  public readonly coAttrItemsDrag = 'co-attr-items-drag';
  public readonly coAttrGroupDrag = 'co-attr-group-drag';

  coAttributeTypes = [CoAttributeType.COMPOSITE, CoAttributeType.SIMPLE];

  constructor() {
  }


  toIdsBoDrag(): string[] {
    const toIds = [];
    this.coAttributeTypes.forEach((c) => {
      [1, 2, 3, 4].forEach((v: number) => toIds.push(c + this.coAttrItemsDrag + v));
    });
    toIds.push(this.coAttrGroupDrag);
    return toIds;
  }

  toIdsCoDrag(coAttributeType: CoAttributeType): string[] {
    if (coAttributeType === CoAttributeType.SIMPLE) {
      return this.toIdsCoDragSimple();
    }
    return [];
  }

  toIdsSimple(items: number[]): string[] {
    const toIds: string[] = [];
    items.forEach((v: number) => toIds.push(CoAttributeType.SIMPLE + this.coAttrItemsDrag + v));
    toIds.push(...this.toIdsCoDragSimple());
    // toIds.push(this.coAttrGroupDrag);
    return toIds;
  }

  toIdsCoDragComposite(): string[] {
    const toIds: string[] = [];
    [1, 2, 3, 4].forEach((v: number) => toIds.push(CoAttributeType.SIMPLE + this.coAttrItemsDrag + v));
    return toIds;
  }

  toIdsCoDragSimple(): string[] {
    const toIds: string[] = [];
    [1, 2, 3, 4].forEach((v: number) => toIds.push(CoAttributeType.COMPOSITE + this.coAttrItemsDrag + v));
    // toIds.push(this.coAttrGroupDrag);
    return toIds;
  }

  dropDefault(event: CdkDragDrop<number[]>): void {
    return;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  sortPredicate(): boolean {
    return false;
  }
}
