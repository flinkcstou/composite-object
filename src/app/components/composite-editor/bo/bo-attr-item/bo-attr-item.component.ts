import { Component, Input, OnInit } from '@angular/core';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';

@Component({
  selector: 'app-bo-attr-item',
  templateUrl: './bo-attr-item.component.html',
  styleUrls: ['./bo-attr-item.component.scss']
})
export class BoAttrItemComponent implements OnInit {

  // @ts-ignore
  @Input() boWithFields: BoRecordWithFields;

  // @ts-ignore
  @Input() field: BoFieldForCo;

  constructor() {
  }

  ngOnInit(): void {
  }

}
