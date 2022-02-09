import { Directive, ElementRef, HostListener, Inject, Input, OnDestroy } from '@angular/core';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { DOCUMENT } from '@angular/common';
import { CoService } from 'src/app/components/services/co.service';
import { LeaderLineDraw, LeaderLineDrawF } from 'src/app/components/composite-editor/models/LeaderLineDraw';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { CoChangeService } from 'src/app/components/services/co-change.service';
import { SubSink } from 'src/app/components/composite-editor/models/exist/SubSink';
import { debounceTime, exhaustMap, filter, switchMap, tap } from 'rxjs/operators';
import { BoFieldLinkF } from 'src/app/components/composite-editor/models/BoFieldLink';
import { safeObserve } from 'src/app/app.component';

declare let LeaderLine: any;

@Directive({
  selector: '[appLeaderLine]'
})
export class LeaderLineDirective implements OnDestroy {


  private subSink = new SubSink();
  private leaderLineDraw: LeaderLineDraw;
  private lines: { leaderLine: any, fieldId: string }[] = [];

  private _field: CoFieldRecord = {} as CoFieldRecord;


  @Input() private coWidgetId;

  @Input() set appLeaderLine(value: CoFieldRecord) {

    this.destroyAll();


    this._field = value;
    this.leaderLineDraw = LeaderLineDrawF.create(value);
    this.coService.leaderLines.push(this.leaderLineDraw);

    this.changeColor();
    this.remove();
    this.scrolling();
    this.refreshLine();
    this.removeLineByBoId();
    this.refreshWidgetLine();

  }

  constructor(private host: ElementRef,
              @Inject(DOCUMENT) private document: Document,
              private coService: CoService,
              private coChangeService: CoChangeService,
  ) {

  }

  ngOnDestroy(): void {
    this.destroyAll();
  }

  destroyAll(): void {
    this.subSink.unsubscribe();
    LeaderLineDraw.removeById(this.leaderLineDraw?.id, this.coService.leaderLines);
    this.leaderLineDraw = null;
    this.removeLines();
  }


  changeColor(): void {
    this.subSink.sink = this.leaderLineDraw.changeColorSubject.subscribe(({color, fieldId}) => {
      const index = this.lines.findIndex((link) => link.fieldId === fieldId);
      if (index === -1) {
        return;
      }
      this.lines[index].leaderLine.color = color;
    });
  }

  remove(): void {
    this.subSink.sink = this.leaderLineDraw.removeLink.asObservable()
      .pipe(
        exhaustMap((fieldId: string) => {
          if (this._field.links.length === 1) {
            return this.removeCoField();
          }
          return this.removeLink(fieldId);
        })
      )
      .subscribe();
  }

  removeLink(fieldId: string): Observable<void> {
    this.removeLine(fieldId);
    const boFieldLink = BoFieldLinkF.find(fieldId, this._field.links);
    this.coChangeService.toggleLeaderLineSubject.next(this.leaderLineDraw.id);
    return this.coService.removeLink(this._field, boFieldLink);
  }

  removeCoField(): Observable<void> {
    this.toggleLeaderLine();
    LeaderLineDraw.removeById(this.leaderLineDraw?.id, this.coService.leaderLines);
    this.leaderLineDraw = null;
    return this.coService.removeCoField(this._field);
  }


  refreshLine(): void {
    this.subSink.sink = safeObserve(
      this.coChangeService.toggleBoSubject.asObservable()).pipe(
      filter(() => this._field.linkLeaderLine),
      tap(() => this.lines.forEach((line) => line.leaderLine?.hide?.())),
      debounceTime(300),
      tap(() => this.lines.forEach((line) => this.showLines())),
    ).subscribe();
  }

  refreshWidgetLine(): void {
    this.subSink.sink = safeObserve(
      this.coChangeService.toggleWidgetSubject.asObservable()).pipe(
      tap((coWidgetId) => {
        if (this._field.linkLeaderLine && this.coWidgetId === coWidgetId) {
          this.toggleLeaderLine();
        }
      }),
      filter(() => this._field.linkLeaderLine),
      tap(() => this.lines.forEach((line) => line.leaderLine?.hide?.())),
      debounceTime(300),
      tap(() => this.lines.forEach((line) => this.showLines())),
    ).subscribe();
  }

  removeLineByBoId(): void {
    this.subSink.sink =
      this.coChangeService.removeBoSubject.asObservable().pipe(
        tap((boId) => {
          if (this._field.linkLeaderLine && this._field.links.some((link) => link.boId === boId)) {
            this.toggleLeaderLine();
          }
        }),
        filter(() => this._field.linkLeaderLine),
        tap(() => this.lines.forEach((line) => line.leaderLine?.hide?.())),
        debounceTime(300),
        tap(() => this.lines.forEach((line) => this.showLines())),
      ).subscribe();
  }

  scrolling(): void {
    const boOverFlow = document.getElementById('boContainerOverFlowId');
    const coOverFlow = document.getElementById('coContainerOverFlowId');
    this.subSink.sink = merge(
      fromEvent(boOverFlow, 'scroll'),
      fromEvent(coOverFlow, 'scroll'),
      this.coChangeService.removeCoFieldSubject.asObservable().pipe(debounceTime(50))
    )
      .subscribe(() => this.lines.forEach((line) => line.leaderLine.position()));
  }

  @HostListener('click', ['$event'])
  toggleLeaderLine(): void {
    this._field.linkLeaderLine = !this._field.linkLeaderLine;
    this.showLines();
  }

  showLines(): void {
    this.removeLines();
    if (this._field.linkLeaderLine) {
      this.createLines();
    }
    this.coChangeService.toggleLeaderLineSubject.next(this.leaderLineDraw.id);
  }

  createLines(): void {
    this.lines = [];
    this._field.links.forEach((link) => {
      let leaderLine;
      try {
        leaderLine = new LeaderLine(
          this.document.getElementById(this._field.coFieldId),
          this.document.getElementById(link.fieldId),
          {
            color: '#2F80ED',
            size: 3,
            dash: {animation: true},
            hide: true
          }
        );
      } catch (e) {
        leaderLine = new LeaderLine(
          this.document.getElementById(this._field.coFieldId),
          this.document.getElementById(link.boId),
          {
            color: '#FF8F51',
            size: 3,
            hide: true
          }
        );
      }
      leaderLine.show('draw');
      this.lines.push({leaderLine, fieldId: link.fieldId});
    });
  }

  removeLines(): void {
    this.lines.forEach((line) => {
      line.leaderLine?.remove?.();
      line.leaderLine = null;
    });
    this.lines = [];
  }

  removeLine(fieldId): void {
    const index = this.lines.findIndex((link) => link.fieldId === fieldId);
    if (index === -1) {
      return;
    }
    this.lines[index].leaderLine.remove();
    this.lines[index].leaderLine = null;
    this.lines.splice(index, 1);
  }

}
