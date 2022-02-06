import { Component, OnInit } from '@angular/core';
import { DragService } from 'src/app/components/services/drag.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonSourceDragDirective } from 'src/app/components/composite-editor/grid-ui/common-source-drag.directive';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';

@Component({
  selector: 'app-co-attr-group-drag',
  templateUrl: './co-attr-group-drag.component.html',
  styleUrls: ['./co-attr-group-drag.component.scss']
})
export class CoAttrGroupDragComponent extends CommonSourceDragDirective<any> implements OnInit {

  constructor(protected dragService: DragService) {
    super(dragService, dragService.coAttrGroupDrag);
  }


  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<BoFieldForCo[]>): void {
    this.dragService.dropCoGroup(event);
  }

}
