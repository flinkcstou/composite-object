import { Component, Input, OnInit } from '@angular/core';
import { CoAttributeType } from 'src/app/components/composite-editor/models/CoAttributeType';

@Component({
  selector: 'app-co-attr-grid',
  templateUrl: './co-attr-grid.component.html',
  styleUrls: ['./co-attr-grid.component.scss']
})
export class CoAttrGridComponent implements OnInit {

  // @ts-ignore
  @Input() coAttributeType: CoAttributeType = CoAttributeType.COMPOSITE;

  CoAttributeType = CoAttributeType;
  items = [1, 2, 3, 4];
  coItem = {
    isExpand: false
  };


  constructor() {
  }

  ngOnInit(): void {
  }

}
