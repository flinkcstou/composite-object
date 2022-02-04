import { Component, OnInit } from '@angular/core';
import { CoService } from 'src/app/components/composite-editor/services/co.service';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { BoFieldView } from 'src/app/components/composite-editor/models/BoFieldView';

@Component({
  selector: 'app-bo-attr-group',
  templateUrl: './bo-attr-group.component.html',
  styleUrls: ['./bo-attr-group.component.scss']
})
export class BoAttrGroupComponent implements OnInit {

  selectedBoItems: BoRecord[] = [];
  boRecordsWithFields: BoRecordWithFields[] = [];



  constructor(private coService: CoService) {
    this.coService.loadBoRecords();
  }

  ngOnInit(): void {
  }

  chooseRecord(): void {
    if (this.selectedBoItems.length === this.coService.boItems.length) {
      return;
    }
    this.selectedBoItems = this.coService.boItems.slice(0, this.selectedBoItems.length + 1);
    const boRecord = this.selectedBoItems[this.selectedBoItems.length - 1];
    this.coService.loadBoFields(boRecord.id).subscribe((l) => {
      this.boRecordsWithFields.push(BoRecordWithFieldsF.toBoWithFields(boRecord, l as BoFieldView[]));
    });
  }
}
