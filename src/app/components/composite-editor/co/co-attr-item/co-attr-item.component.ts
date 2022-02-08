import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { CoService } from 'src/app/components/services/co.service';

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

  constructor(private coService: CoService) {
  }

  ngOnInit(): void {
  }

  remove($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.coService.removeCoField(this.field.coFieldId);
    this.coService.coFieldsSimple.splice(this.coService.coFieldsSimple.findIndex((field) => field.coFieldId === this.field.coFieldId), 1);
  }
}
