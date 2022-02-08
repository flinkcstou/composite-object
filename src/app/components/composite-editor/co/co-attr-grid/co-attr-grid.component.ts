import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CoWidget } from 'src/app/components/composite-editor/models/CoWidget';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoChangeService } from 'src/app/components/services/co-change.service';

@Component({
  selector: 'app-co-attr-grid',
  templateUrl: './co-attr-grid.component.html',
  styleUrls: ['./co-attr-grid.component.scss']
})
export class CoAttrGridComponent implements OnInit, OnChanges {

  // @ts-ignore
  @Input() coWidget: CoWidget;
  CoWidgetType = CoWidgetType;

  load$: Observable<any>;

  constructor(private coChangeService: CoChangeService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load$ = this.coWidget.toggleSubject.asObservable()
      .pipe(
        tap(() => this.coChangeService.toggleWidgetSubject.next(this.coWidget.id))
      );
  }


}
