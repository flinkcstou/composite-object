import { ContentChild, Directive, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { BoAttrItemComponent } from 'src/app/components/composite-editor/bo/bo-attr-item/bo-attr-item.component';
import { CdkDrag, CdkDragEnd, CdkDragEnter, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';

@Directive()
export class CommonSourceDragDirective {

  @Input() public items: any;

  // @ts-ignore
  @ContentChild('item', {static: false}) public itemTemplateRef: TemplateRef<BoAttrItemComponent>;

  // @ts-ignore
  @ViewChildren('cdkDropList') cdkDropList: QueryList<CdkDropList>;

  public toIds: string[] = [];

  public isReplacementShow = false;
  public isDraggable = false;

  constructor(public id: string) {
  }

  sortPredicate(index: number, item: CdkDrag<number>): boolean {
    return false;
  }

  cdkDragStarted($event: CdkDragStart, bodyC: HTMLElement, replacementC: HTMLElement): void {
    this.isDraggable = true;
    replacementC.innerHTML = bodyC.innerHTML;
  }

  cdkDragEntered($event: CdkDragEnter<any>): void {
    this.isReplacementShow = !$event.container.id.includes(this.id);
  }

  cdkDragEnded($event: CdkDragEnd, replacementC: HTMLElement): void {
    this.isDraggable = false;
    this.isReplacementShow = false;
    replacementC.innerHTML = '';
  }

  updatePosition($event: CdkDragStart): void {
    setTimeout(() => {
      // @ts-ignore
      this.cdkDropList.forEach((item: any) => item._dropListRef.enter($event.source._dragRef, 1, 1, $event.source['_initialIndex']));
    }, 500);
  }


}
