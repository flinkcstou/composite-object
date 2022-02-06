import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { CoService } from 'src/app/components/services/co.service';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';

@Injectable({
  providedIn: 'root'
})
export class DragService {

  public readonly boAttrItemsDrag = 'bo-attr-items-drag';
  public readonly coAttrItemsDrag = 'co-attr-items-drag';
  public readonly coAttrGroupDrag = 'co-attr-group-drag';


  private boDraggableBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public boDraggable$$: Observable<boolean> = this.boDraggableBehaviorSubject.asObservable();

  constructor(private coService: CoService) {
  }

  set isBoDraggable(value: boolean) {
    this.boDraggableBehaviorSubject.next(value);
  }

  expandCo(): void {
    this.coService.coWidgets.forEach((c: any) => c.isExpand = true);
  }

  isExpand(): boolean {
    return this.coService.coWidgets.some((c: any) => !c?.isExpand);
  }

  toIdsBoDrag(): string[] {
    const simpleIds = this.coService.coFieldsSimple.map((i: CoFieldRecord) => i.coFieldId);
    const compositeIds = this.coService.coFieldsComposite.map((i: CoFieldRecord) => i.coFieldId);
    return [...simpleIds, ...compositeIds, this.coAttrGroupDrag];
  }

  toIdsCoSimple(item: CoFieldRecord): string[] {
    const simpleIds = this.coService.coFieldsSimple.filter((i: CoFieldRecord) => i.coFieldId !== item.coFieldId).map((i: CoFieldRecord) => i.coFieldId);
    const compositeIds = this.coService.coFieldsComposite.map((i: CoFieldRecord) => i.coFieldId);
    return [...simpleIds, ...compositeIds];
  }

  toIdsEmpty(): string[] {
    return [];
  }


  dropDefault(event: CdkDragDrop<any>): void {
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

  dropCoGroup(event: CdkDragDrop<BoFieldForCo[]>) {
    this.coService.droptoCoGroup(event);
  }
}
