import { Component, Input, OnInit } from '@angular/core';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { StyleFieldF } from 'src/app/components/composite-editor/models/StyleField';

@Component({
  selector: 'app-bo-attr-grid',
  templateUrl: './bo-attr-grid.component.html',
  styleUrls: ['./bo-attr-grid.component.scss']
})
export class BoAttrGridComponent implements OnInit {

  //@ts-ignore
  @Input() boFields: BoRecordWithFields;

  constructor() {
  }

  ngOnInit(): void {
  }

  clearCheck(): void {
    StyleFieldF.clearCheck(this.boFields);
  }
}
