import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { DragService } from 'src/app/components/composite-editor/services/drag.service';
import { CoAttributeType } from 'src/app/components/composite-editor/models/CoAttributeType';
import { CommonSourceDragDirective } from 'src/app/components/composite-editor/grid-ui/common-source-drag.directive';

@Component({
  selector: 'app-co-attr-item-drag',
  templateUrl: './co-attr-item-drag.component.html',
  styleUrls: ['./co-attr-item-drag.component.scss']
})
export class CoAttrItemDragComponent extends CommonSourceDragDirective implements OnInit {


  // @ts-ignore
  _coAttributeType: CoAttributeType = CoAttributeType.COMPOSITE;

  CoAttributeType = CoAttributeType;

  @Input() set coAttributeType(value: CoAttributeType) {
    this._coAttributeType = value;
    this.toIds = this.dragService.toIdsCoDrag(this._coAttributeType);
  }

  @Input() set coItem(value: any) {
    this.dragService.coItems.push(value);
  }


  constructor(protected dragService: DragService) {
    super(dragService, dragService.coAttrItemsDrag);
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    this.dragService.dropDefault(event);
  }

  started($event: CdkDragStart, bodyC: HTMLElement, replacementC: HTMLElement, item: any, cdkDropList: CdkDropList): void {
    const dynamicIds = this.items.filter((i: number) => i !== item);
    this.toIds = this.dragService.toIdsSimple(dynamicIds);
    cdkDropList.connectedTo = this.toIds;

    this.cdkDragStarted($event, bodyC, replacementC);
  }

  entered($event: CdkDragEnter<any>): void {
    this.cdkDragEntered($event);
  }

  ended($event: CdkDragEnd, replacementC: HTMLElement): void {
    this.cdkDragEnded($event, replacementC);
    this.toIds = this.dragService.toIdsCoDrag(this._coAttributeType);
  }
}
