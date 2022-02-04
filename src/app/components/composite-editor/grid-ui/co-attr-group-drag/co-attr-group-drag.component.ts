import { Component, OnInit } from '@angular/core';
import { DragService } from 'src/app/components/services/drag.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonSourceDragDirective } from 'src/app/components/composite-editor/grid-ui/common-source-drag.directive';

@Component({
  selector: 'app-co-attr-group-drag',
  templateUrl: './co-attr-group-drag.component.html',
  styleUrls: ['./co-attr-group-drag.component.scss']
})
export class CoAttrGroupDragComponent extends CommonSourceDragDirective implements OnInit {

  constructor(protected dragService: DragService) {
    super(dragService, dragService.coAttrGroupDrag);
  }


  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    this.dragService.dropDefault(event);
  }

}
