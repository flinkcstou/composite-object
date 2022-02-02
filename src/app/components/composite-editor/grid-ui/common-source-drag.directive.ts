import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { BoAttrItemComponent } from 'src/app/components/composite-editor/bo/bo-attr-item/bo-attr-item.component';
import { CdkDrag, CdkDragEnd, CdkDragEnter, CdkDragStart } from '@angular/cdk/drag-drop';

@Directive()
export class CommonSourceDragDirective {

  @Input() public items: any;

  // @ts-ignore
  @ContentChild('item', {static: false}) public itemTemplateRef: TemplateRef<BoAttrItemComponent>;

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


}
