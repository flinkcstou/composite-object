import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { CoService } from 'src/app/components/services/co.service';
import { fromEvent, Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-co-attr-item',
  templateUrl: './co-attr-item.component.html',
  styleUrls: ['./co-attr-item.component.scss']
})
export class CoAttrItemComponent implements OnInit, AfterViewInit {


  // @ts-ignore
  @Input() field: CoFieldRecord;

  @ViewChild('removeCo', {read: ElementRef}) removeCo: ElementRef<HTMLDivElement>;

  remove$: Observable<any>;


  constructor(private coService: CoService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.remove$ = fromEvent(this.removeCo.nativeElement, 'click')
      .pipe(exhaustMap(() => this.coService.removeCoField(this.field)));
  }
}
