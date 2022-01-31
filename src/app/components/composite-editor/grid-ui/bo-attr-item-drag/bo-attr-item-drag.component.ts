import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoAttrItemComponent } from 'src/app/components/composite-editor/bo/bo-attr-item/bo-attr-item.component';
import { DragService } from 'src/app/components/composite-editor/services/drag.service';

@Component({
  selector: 'app-bo-attr-item-drag',
  templateUrl: './bo-attr-item-drag.component.html',
  styleUrls: ['./bo-attr-item-drag.component.scss']
})
export class BoAttrItemDragComponent implements OnInit {

  @Input() items: any;

  // @ts-ignore
  @ContentChild('item', {static: false}) itemTemplateRef: TemplateRef<BoAttrItemComponent>;


  id;
  toIds: string[] = [];

  constructor(private dragService: DragService) {
    this.id = this.dragService.boAttrItemsDrag;
    this.toIds = this.dragService.toIdsBoDrag();
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    this.dragService.dropDefault(event);
  }

}
