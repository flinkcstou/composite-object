import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';
import { fromEvent, Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';


@Component({
  selector: 'app-composite-editor',
  templateUrl: './composite-editor.component.html',
  styleUrls: ['./composite-editor.component.scss']
})
export class CompositeEditorComponent implements OnInit, AfterViewInit {


  // @ts-ignore
  @ViewChild('save', {read: ElementRef}) saveElement: ElementRef;

  // @ts-ignore
  @ViewChild('cancel', {read: ElementRef}) cancelElement: ElementRef;

  load$: Observable<any>;

  constructor(private coService: CoService) {
  }

  ngOnInit(): void {
    this.coService.generateFirstDraft().subscribe();
  }

  ngAfterViewInit(): void {
    this.load$ = fromEvent(this.saveElement.nativeElement, 'click').pipe(exhaustMap(() => this.coService.apply()));
  }


}
