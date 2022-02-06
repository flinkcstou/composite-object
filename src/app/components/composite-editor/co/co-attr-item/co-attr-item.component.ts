import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';

@Component({
  selector: 'app-co-attr-item',
  templateUrl: './co-attr-item.component.html',
  styleUrls: ['./co-attr-item.component.scss']
})
export class CoAttrItemComponent implements OnInit {


  // @ts-ignore
  @Input() field: CoFieldRecord;

  @HostBinding('class.check') get getCheck(): boolean {
    return this.field?.isChecked;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
