import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { DOCUMENT } from '@angular/common';
import { CoService } from 'src/app/components/services/co.service';
import { LeaderLineDraw, LeaderLineDrawF } from 'src/app/components/composite-editor/models/LeaderLineDraw';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { CoChangeService } from 'src/app/components/services/co-change.service';
import { SubSink } from 'src/app/components/composite-editor/models/exist/SubSink';
import { debounceTime, exhaustMap, filter, switchMap, tap } from 'rxjs/operators';
import { BoFieldLink, BoFieldLinkF } from 'src/app/components/composite-editor/models/BoFieldLink';
import { safeObserve } from 'src/app/app.component';

declare let LeaderLine: any;

@Directive({
  selector: '[appLeaderLine]'
})
export class LeaderLineDirective implements OnDestroy, AfterViewInit {


  private subSink = new SubSink();
  private leaderLineDraw: LeaderLineDraw;
  private lines: { leaderLine: any, icon: any, fieldId: string }[] = [];

  private _field: CoFieldRecord = {} as CoFieldRecord;
  private boOverFlow: HTMLElement;
  private coOverFlow: HTMLElement;
  private coFieldId: HTMLElement;


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
              private renderer: Renderer2,
              private coChangeService: CoChangeService,
  ) {

    this.boOverFlow = this.document.getElementById('boContainerOverFlowId');
    this.coOverFlow = this.document.getElementById('coContainerOverFlowId');

  }

  ngAfterViewInit(): void {
    setTimeout(() => this.coFieldId = this.document.getElementById(this._field.coFieldId));
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
      tap(() => this.showLines()),
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
      tap(() => this.showLines()),
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
        tap(() => this.showLines()),
      ).subscribe();
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
      let icon;
      const boFieldId = this.document.getElementById(link.fieldId);
      const boId = this.document.getElementById(link.boId);
      if (boFieldId) {
        leaderLine = this.createDependenceByScroll(boFieldId);
        icon = this.createIcon(boFieldId, link);
      } else {
        leaderLine = this.createDependenceByScroll(boId, '#FF8F51');
        icon = {};
      }
      leaderLine.show('draw');
      this.lines.push({leaderLine, icon, fieldId: link.fieldId});
    });
  }

  removeLines(): void {
    this.lines.forEach((line) => {
      line.leaderLine?.remove?.();
      line.leaderLine = null;
      this.removeIcon(line);
    });
    this.lines = [];
  }

  removeLine(fieldId): void {
    const index = this.lines.findIndex((link) => link.fieldId === fieldId);
    if (index === -1) {
      return;
    }
    const line = this.lines[index];
    line.leaderLine?.remove?.();
    line.leaderLine = null;
    this.removeIcon(line);

    this.lines.splice(index, 1);
  }

  removeIcon(line: any): void {
    if (!line.icon.id) {
      return;
    }
    const elementById = this.document.getElementById(line.icon.id);
    elementById.parentNode.removeChild(elementById);
    line.icon.listens.forEach(listen => listen());
    line.icon = null;
  }

  scrolling(): void {
    this.subSink.sink = merge(
      fromEvent(this.boOverFlow, 'scroll'),
      fromEvent(this.coOverFlow, 'scroll'),
      this.coChangeService.removeCoFieldSubject.asObservable())
      .pipe(debounceTime(50),
        filter(() => this._field.linkLeaderLine),
        tap(() => this.lines.forEach((line) => line.leaderLine?.hide?.())),
        debounceTime(300),
        tap(() => this.showLines()))
      .subscribe();

  }

  createIcon(boFieldId, link: BoFieldLink): any {
    const boFieldBoundingClientRect = boFieldId.getBoundingClientRect();
    const boClientHeight = this.boOverFlow.clientHeight;
    const boBoundingClientRect = this.boOverFlow.getBoundingClientRect();

    const overTop = boFieldBoundingClientRect.top - boBoundingClientRect.top + 10;
    const overBottom = boFieldBoundingClientRect.bottom - boClientHeight - boBoundingClientRect.top - 10;

    if (overTop <= 0) {
      return {};
    }
    if (overBottom >= 0) {
      return {};
    }
    return this.createMatIcon(boFieldId, link);
  }

  createMatIcon(boFieldId: HTMLElement, link: BoFieldLink): any {

    const listens = [];
    const boFieldBoundingClientRect = boFieldId.getBoundingClientRect();

    // Use Angular's Renderer2 to create the div element
    const recaptchaContainer = this.renderer.createElement('div');
    // Set the id of the div
    this.renderer.setProperty(recaptchaContainer, 'id', 'no-color-delete' + link.fieldId);
    this.renderer.setStyle(recaptchaContainer, 'position', 'absolute');
    this.renderer.setStyle(recaptchaContainer, 'top', `${boFieldBoundingClientRect.top + 20}px`);
    this.renderer.setStyle(recaptchaContainer, 'right', `${boFieldBoundingClientRect.right}px`);

    // recaptchaContainer.innerHTML = document.getElementById('absNoColoDeleteIcon').innerHTML;
    // Append the created div to the body element
    this.renderer.appendChild(recaptchaContainer, this.document.getElementById('absNoColoDeleteIcon').cloneNode(true));
    this.renderer.appendChild(this.document.body, recaptchaContainer);

    const mouseEnter = this.renderer.listen(recaptchaContainer, 'mouseenter', () => {
      this.leaderLineDraw?.changeColorSubject?.next({color: '#EE5252', fieldId: link.fieldId});

    });
    const mouseLeave = this.renderer.listen(recaptchaContainer, 'mouseleave', () => {
      this.leaderLineDraw?.changeColorSubject?.next({color: '#2F80ED', fieldId: link.fieldId});
    });
    const click = this.renderer.listen(recaptchaContainer, 'click', () => {
      this.leaderLineDraw?.removeLink?.next(link.fieldId);
    });
    listens.push(mouseEnter, mouseLeave, click);

    return {
      listens: listens,
      id: 'no-color-delete' + link.fieldId
    };
  }


  getLeftScroll(boFieldId: HTMLElement, boOverFlow: HTMLElement, isBoField = true): any {

    const boFieldBoundingClientRect = boFieldId.getBoundingClientRect();
    const boClientHeight = boOverFlow.clientHeight;
    const boBoundingClientRect = boOverFlow.getBoundingClientRect();

    const overTop = boFieldBoundingClientRect.top - boBoundingClientRect.top + 10;
    const overBottom = boFieldBoundingClientRect.bottom - boClientHeight - boBoundingClientRect.top - 10;

    if (overTop <= 0) {
      return {
        id: this.document.getElementById('coOverTopId'),
        plug: 'behind',
        over: true,
      };
    }
    if (overBottom >= 0) {
      return {
        id: this.document.getElementById('coOverBottomId'),
        plug: 'behind',
        over: true,
      };
    }
    return {
      id: boFieldId,
      plug: 'arrow1',
      over: false,
    };
  }

  createDependenceByScroll(boFieldId: HTMLElement, color = '#2F80ED'): any {
    const leftScroll = this.getLeftScroll(boFieldId, this.boOverFlow);
    const rightScroll = this.getLeftScroll(this.coFieldId, this.coOverFlow);
    if (rightScroll.over) {
      return {
        remove: () => {
        },
        hide: () => {
        },
        show: () => {
        },
        color: ''
      } as any;
    }
    if (leftScroll.over) {
      return new LeaderLine(
        rightScroll.id,
        leftScroll.id,
        {
          color,
          size: 3,
          hide: true,
          endPlug: leftScroll.plug,
        }
      );
    }
    return new LeaderLine(
      rightScroll.id,
      LeaderLine
        .pointAnchor(leftScroll.id, {
          x: '106%',
          y: 20
        }),
      {
        color,
        size: 3,
        hide: true,
        endPlug: leftScroll.plug,
        endSocket: 'right'
      }
    );


  }


}
