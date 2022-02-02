import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragStart } from '@angular/cdk/drag-drop';
import { DragService } from 'src/app/components/composite-editor/services/drag.service';
import { CommonSourceDragDirective } from 'src/app/components/composite-editor/grid-ui/common-source-drag.directive';

@Component({
  selector: 'app-bo-attr-item-drag',
  templateUrl: './bo-attr-item-drag.component.html',
  styleUrls: ['./bo-attr-item-drag.component.scss']
})
export class BoAttrItemDragComponent extends CommonSourceDragDirective implements OnInit {

  constructor(private dragService: DragService) {
    super(dragService.boAttrItemsDrag);
    this.toIds = this.dragService.toIdsBoDrag();
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    this.dragService.dropDefault(event);
  }

  started($event: CdkDragStart, bodyC: HTMLElement, replacementC: HTMLElement): void {
    this.cdkDragStarted($event, bodyC, replacementC);
    this.dragService.expandCo();
  }

  entered($event: CdkDragEnter<any>): void {
    this.cdkDragEntered($event);
  }

  ended($event: CdkDragEnd, replacementC: HTMLElement): void {
    this.cdkDragEnded($event, replacementC);
  }
}
