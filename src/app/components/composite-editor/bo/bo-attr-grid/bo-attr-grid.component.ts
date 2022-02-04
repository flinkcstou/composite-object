import { Component, Input, OnInit } from '@angular/core';
import { BoRecordWithFields, BoRecordWithFieldsF } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { StyleFieldF } from 'src/app/components/composite-editor/models/StyleField';
import { CoService } from 'src/app/components/services/co.service';
import { Subject } from 'rxjs';
import { exhaustMap, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-bo-attr-grid',
  templateUrl: './bo-attr-grid.component.html',
  styleUrls: ['./bo-attr-grid.component.scss']
})
export class BoAttrGridComponent implements OnInit {

  //@ts-ignore
  @Input() boWithFields: BoRecordWithFields;

  toggleSubject = new Subject();

  constructor(private coService: CoService) {
    this.toggle();
  }

  ngOnInit(): void {
  }

  toggle(): void {
    this.toggleSubject
      .pipe(
        tap(() => StyleFieldF.clearCheck(this.boWithFields)),
        exhaustMap(() => this.coService.loadBoFieldsForCo(this.boWithFields)),
      )
      .subscribe();
  }
}
