import { Component, OnInit } from '@angular/core';
import { DragService } from 'src/app/components/composite-editor/services/drag.service';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-co-attr-group-drag',
  templateUrl: './co-attr-group-drag.component.html',
  styleUrls: ['./co-attr-group-drag.component.scss']
})
export class CoAttrGroupDragComponent implements OnInit {

  id;
  toIds: string[] = [];

  constructor(private dragService: DragService) {
    this.id = this.dragService.coAttrGroupDrag;
  }


  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    this.dragService.dropDefault(event);
  }

  sortPredicate(index: number, item: CdkDrag<number>): boolean {
    return false;
  }

}
