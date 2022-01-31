import { Component, OnInit } from '@angular/core';
import { CoAttributeType } from 'src/app/components/composite-editor/models/CoAttributeType';

@Component({
  selector: 'app-co-attr-group',
  templateUrl: './co-attr-group.component.html',
  styleUrls: ['./co-attr-group.component.scss']
})
export class CoAttrGroupComponent implements OnInit {

  coAttributeTypes = [CoAttributeType.COMPOSITE, CoAttributeType.SIMPLE];

  constructor() {
  }

  ngOnInit(): void {
  }

}
