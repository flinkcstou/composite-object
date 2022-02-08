import { Component, OnInit } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { EditingService } from 'src/app/components/services/editing.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bo-attr-group',
  templateUrl: './bo-attr-group.component.html',
  styleUrls: ['./bo-attr-group.component.scss']
})
export class BoAttrGroupComponent implements OnInit {


  boRecordsWithFields$: Observable<any>;

  constructor(private coService: CoService,
              private editingService: EditingService
  ) {
    this.boRecordsWithFields$ = this.coService.boRecordsWithFields$;
  }

  ngOnInit(): void {
  }

  getId = (index: number, field: BoRecordWithFields) => field.id;

  chooseRecord(): void {
    if (!this.editingService.boRecords.length) {
      return;
    }
    if (this.coService.boRecordsWithFields.length === this.editingService.boRecords.length) {
      return;
    }
    const boRecords = this.editingService.boRecords.slice(0, this.coService.boRecordsWithFields.length + 1);
    const boRecord = boRecords[boRecords.length - 1];
    this.coService.addBoToCo(boRecord.id).subscribe();
  }
}
