import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { StyleFieldF } from 'src/app/components/composite-editor/models/StyleField';
import { CoService } from 'src/app/components/services/co.service';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { exhaustMap, mapTo, tap } from 'rxjs/operators';
import { CoChangeService } from 'src/app/components/services/co-change.service';

@Component({
  selector: 'app-bo-attr-grid',
  templateUrl: './bo-attr-grid.component.html',
  styleUrls: ['./bo-attr-grid.component.scss']
})
export class BoAttrGridComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() boWithFields: BoRecordWithFields;

  @ViewChild('removeBo') removeBo: ElementRef<HTMLDivElement>;

  load$: Observable<any>;
  remove$: Observable<any>;

  constructor(private coService: CoService,
              private coChangeService: CoChangeService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load$ = this.boWithFields.toggleSubject
      .pipe(
        tap(() => this.coChangeService.toggleBoSubject.next(this.boWithFields.id)),
        tap(() => StyleFieldF.clearCheck(this.boWithFields)),
        tap(() => this.coChangeService.calcCountCheck(true, true)),
        exhaustMap(() => this.coService.loadBoFieldsForCo(this.boWithFields))
      );
  }

  ngAfterViewInit(): void {
    this.remove$ = fromEvent(this.removeBo.nativeElement, 'click')
      .pipe(
        exhaustMap(() => this.coService.removeBo(this.boWithFields)),
        tap(() => this.boWithFields.removeSubject.next(this.boWithFields.id)),
        tap(() => this.coChangeService.removeBoSubject.next(this.boWithFields.id))
      );
  }
}
