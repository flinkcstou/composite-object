import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { DragService } from 'src/app/components/services/drag.service';
import { CommonSourceDragDirective } from 'src/app/components/composite-editor/grid-ui/common-source-drag.directive';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';

@Component({
  selector: 'app-bo-attr-item-drag',
  templateUrl: './bo-attr-item-drag.component.html',
  styleUrls: ['./bo-attr-item-drag.component.scss']
})
export class BoAttrItemDragComponent extends CommonSourceDragDirective<BoFieldForCo> implements OnInit {

  constructor(protected dragService: DragService) {
    super(dragService, dragService.boAttrItemsDrag);
  }

  ngOnInit(): void {
  }

  mousedown($event: MouseEvent, cdkDropList: CdkDropList): void {
    this.toIds = this.dragService.toIdsBoDrag();
    cdkDropList.connectedTo = this.toIds;

  }

  mouseup($event: MouseEvent): void {
    this.toIds = this.dragService.toIdsEmpty();
  }

  createPreview(item: BoFieldForCo): void {
    const isScope = !!(this.dragService.countCheckBoField() - 1);
    this.preview = {
      isScope,
      label: isScope ? `${item.label}(+${this.dragService.countCheckBoField()})` : item.label
    };
  }

  started($event: CdkDragStart, bodyC: HTMLElement, replacementC: HTMLElement, item: BoFieldForCo): void {
    this.cdkDragStarted($event, bodyC, replacementC);
    this.setPosition($event);
    this.createPreview(item);
  }

  entered($event: CdkDragEnter<BoFieldForCo[]>, item: BoFieldForCo): void {
    this.cdkDragEntered($event, item);
  }

  ended($event: CdkDragEnd, replacementC: HTMLElement, item: BoFieldForCo): void {
    this.cdkDragEnded($event, replacementC, item);
    this.toIds = this.dragService.toIdsEmpty();
  }

  dropped($event: CdkDragDrop<BoFieldForCo[]>): void {
    if ($event.container.id !== this.dragService.boAttrItemsDrag) {
      this.dragService.unCheckBoField();
    }
  }
}
