import { ContentChild, Directive, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { BoAttrItemComponent } from 'src/app/components/composite-editor/bo/bo-attr-item/bo-attr-item.component';
import { CdkDrag, CdkDragEnd, CdkDragEnter, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DragService } from 'src/app/components/composite-editor/services/drag.service';

@Directive()
export class CommonSourceDragDirective {

  @Input() public items: any;

  // @ts-ignore
  @ContentChild('item', {static: false}) public itemTemplateRef: TemplateRef<BoAttrItemComponent>;

  // @ts-ignore
  @ViewChildren('cdkDropList') cdkDropList: QueryList<CdkDropList>;

  private updatePositionSubject: Subject<CdkDragStart> = new Subject<CdkDragStart>();

  public toIds: string[] = [];

  public isReplacementShow = false;
  public isDraggable = false;

  constructor(protected dragService: DragService, public id: string) {
    this.updateIsBoDraggable();
    this.updatePosition();
  }


  private updatePosition(): void {
    // проблема заключается в том что не видит другие зоны sdkDropList при expandable panel component
    this.updatePositionSubject.asObservable()
      .pipe(
        debounceTime(500),
        filter(() => this.isDraggable)
      )
      .subscribe(($event: CdkDragStart) => {
        try {
          // @ts-ignore
          this.cdkDropList.forEach((item: any) => item._dropListRef.enter($event.source._dragRef, 1, 1, $event.source['_initialIndex']));
        } catch (e) {
          console.error('crash cdkDropList dropZones', e);
        }
      });
  }

  private updateIsBoDraggable(): void {
    if (this.id === this.dragService.boAttrItemsDrag) {
      this.dragService.boDraggable$$.subscribe((b: boolean) => this.isDraggable = b);
    }
  }

  setPosition($event: CdkDragStart): void {
    if (this.dragService.coItems.some((c: any) => !c?.isExpand)) {
      this.updatePositionSubject.next($event);
    }
    this.dragService.expandCo();
  }

  sortPredicate(index: number, item: CdkDrag<number>): boolean {
    return false;
  }

  setIsDraggable(value: boolean): void {
    this.isDraggable = value;
    if (this.id === this.dragService.boAttrItemsDrag) {
      this.dragService.isBoDraggable = value;
    }
  }

  cdkDragStarted($event: CdkDragStart, bodyC: HTMLElement, replacementC: HTMLElement): void {
    this.setIsDraggable(true);
    replacementC.innerHTML = bodyC.innerHTML;
  }

  cdkDragEntered($event: CdkDragEnter<any>): void {
    this.isReplacementShow = !$event.container.id.includes(this.id);
  }

  cdkDragEnded($event: CdkDragEnd, replacementC: HTMLElement): void {
    this.setIsDraggable(false);
    this.isReplacementShow = false;
    replacementC.innerHTML = '';
  }


}
