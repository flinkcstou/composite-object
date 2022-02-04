import { Component, Input, OnInit } from '@angular/core';
import { BoFieldView } from 'src/app/components/composite-editor/models/BoFieldView';

@Component({
  selector: 'app-bo-attr-item',
  templateUrl: './bo-attr-item.component.html',
  styleUrls: ['./bo-attr-item.component.scss']
})
export class BoAttrItemComponent implements OnInit {


  // @ts-ignore
  @Input() field: BoFieldView;

  constructor() {
  }

  ngOnInit(): void {
  }

}
