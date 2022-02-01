import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { BoAttrItemComponent } from 'src/app/components/composite-editor/bo/bo-attr-item/bo-attr-item.component';
import { DragService } from 'src/app/components/composite-editor/services/drag.service';
import { CoAttributeType } from 'src/app/components/composite-editor/models/CoAttributeType';

@Component({
  selector: 'app-co-attr-item-drag',
  templateUrl: './co-attr-item-drag.component.html',
  styleUrls: ['./co-attr-item-drag.component.scss']
})
export class CoAttrItemDragComponent implements OnInit {

  @Input() items: any;

  // @ts-ignore
  _coAttributeType: CoAttributeType = CoAttributeType.COMPOSITE;

  CoAttributeType = CoAttributeType;

  @Input() set coAttributeType(value: CoAttributeType) {
    this._coAttributeType = value;
    this.toIds = this.dragService.toIdsCoDrag(this._coAttributeType);
    console.error(this.toIds);
  }


  // @ts-ignore
  @ContentChild('item', {static: false}) itemTemplateRef: TemplateRef<BoAttrItemComponent>;


  id;
  toIds: string[] = [];

  constructor(private dragService: DragService) {
    this.id = this.dragService.coAttrItemsDrag;
    // this.toIds.push(this.dragService.coAttrGroupDrag);
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    this.dragService.dropDefault(event);
  }

  sortPredicate(index: number, item: CdkDrag<number>): boolean {
    return false;
  }

  entered($event: CdkDragStart, item: any): void {
    const dynamicIds = this.items.filter((i: number) => i !== item);
    this.toIds = this.dragService.toIdsSimple(dynamicIds);

  }

  copyPlaceHolderDrag(item: any, bodyContainer: HTMLElement, innerHide: HTMLElement, csdf: CdkDropList): void {
    const dynamicIds = this.items.filter((i: number) => i !== item);
    this.toIds = this.dragService.toIdsSimple(dynamicIds);
    csdf.connectedTo = this.toIds;
    innerHide.innerHTML = bodyContainer.innerHTML;
  }

  ended($event: CdkDragEnd, item: any): void {
    this.toIds = this.dragService.toIdsCoDrag(this._coAttributeType);
  }
}
