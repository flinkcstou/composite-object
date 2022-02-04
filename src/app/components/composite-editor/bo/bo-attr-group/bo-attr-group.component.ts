import { Component, OnInit } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { EditingService } from 'src/app/components/services/editing.service';

@Component({
  selector: 'app-bo-attr-group',
  templateUrl: './bo-attr-group.component.html',
  styleUrls: ['./bo-attr-group.component.scss']
})
export class BoAttrGroupComponent implements OnInit {

  boRecordsWithFields: BoRecordWithFields[] = [];


  constructor(private coService: CoService,
              private editingService: EditingService
  ) {
    this.boRecordsWithFields = this.coService.boRecordsWithFields;
  }

  ngOnInit(): void {
  }

  chooseRecord(): void {
    if (this.boRecordsWithFields.length === this.editingService.boRecords.length) {
      return;
    }
    const boRecords = this.editingService.boRecords.slice(0, this.boRecordsWithFields.length + 1);
    const boRecord = boRecords[boRecords.length - 1];
    this.coService.addBoToCo(boRecord.id).subscribe();
  }
}
