import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';

@Component({
  selector: 'app-bo-attr-item',
  templateUrl: './bo-attr-item.component.html',
  styleUrls: ['./bo-attr-item.component.scss']
})
export class BoAttrItemComponent implements OnInit {

  @Input() boWithFields: BoRecordWithFields | undefined;

  @Input() field: BoFieldForCo | undefined;

  @Input() last: boolean | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostBinding('class.last') get getLast(): boolean {
    return this.last;
  }
}
