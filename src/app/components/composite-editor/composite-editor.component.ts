import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';
import { fromEvent, Observable } from 'rxjs';
import { exhaustMap, mergeMap } from 'rxjs/operators';
import { CoChangeService } from 'src/app/components/services/co-change.service';


@Component({
  selector: 'app-composite-editor',
  templateUrl: './composite-editor.component.html',
  styleUrls: ['./composite-editor.component.scss']
})
export class CompositeEditorComponent implements OnInit, AfterViewInit {


  load$: Observable<any>;

  constructor(private coService: CoService,
              private coChangeService: CoChangeService) {
    this.load$ = this.coChangeService.changedBehavior.asObservable();
  }

  ngOnInit(): void {
    this.coService.generateFirstDraft().subscribe();
  }

  ngAfterViewInit(): void {
    // this.load$ = fromEvent(this.saveElement.nativeElement, 'click').pipe(exhaustMap(() => this.coService.apply()));
  }

  save() {
    this.coService.apply().subscribe();
  }

  cancel() {
    this.coService.cancel().subscribe();
  }


}
