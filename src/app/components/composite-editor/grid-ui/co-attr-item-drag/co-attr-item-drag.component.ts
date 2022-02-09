import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { DragService } from 'src/app/components/services/drag.service';
import { CommonSourceDragDirective } from 'src/app/components/composite-editor/grid-ui/common-source-drag.directive';
import { CoWidget } from 'src/app/components/composite-editor/models/CoWidget';
import { CoWidgetType } from '../../models/CoWidgetType';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';

@Component({
  selector: 'app-co-attr-item-drag',
  templateUrl: './co-attr-item-drag.component.html',
  styleUrls: ['./co-attr-item-drag.component.scss']
})
export class CoAttrItemDragComponent extends CommonSourceDragDirective<CoFieldRecord> implements OnInit {

  // @ts-ignore
  @Input() coWidget: CoWidget;
  CoWidgetType = CoWidgetType;

  constructor(protected dragService: DragService) {
    super(dragService, dragService.coAttrItemsDrag);
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<CoFieldRecord[]>): void {
    this.dragService.dropCoComposite(event);
  }


  mousedown($event: MouseEvent, item: CoFieldRecord, cdkDropList: CdkDropList): void {
    this.toIds = this.dragService.toIdsCoSimple(item);
    cdkDropList.connectedTo = this.toIds;
  }

  mouseup($event: MouseEvent): void {
    this.toIds = this.dragService.toIdsEmpty();
  }

  started($event: CdkDragStart, bodyC: HTMLElement, replacementC: HTMLElement): void {
    this.cdkDragStarted($event, bodyC, replacementC);
    this.dragService.unCheckBoField();
  }

  entered($event: CdkDragEnter<CoFieldRecord[]>, item: CoFieldRecord): void {
    this.cdkDragEntered($event, item);
  }

  ended($event: CdkDragEnd, replacementC: HTMLElement, item: CoFieldRecord): void {
    this.cdkDragEnded($event, replacementC, item);
    this.toIds = this.dragService.toIdsEmpty();
  }
}
