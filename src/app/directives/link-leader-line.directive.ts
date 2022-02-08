import { Directive, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { CoService } from 'src/app/components/services/co.service';
import { CoChangeService } from 'src/app/components/services/co-change.service';
import { SubSink } from 'src/app/components/composite-editor/models/exist/SubSink';
import { LeaderLineDraw } from 'src/app/components/composite-editor/models/LeaderLineDraw';

@Directive({
  selector: '[appLinkLeaderLine]',
  exportAs: 'appLinkLeaderLine'
})
export class LinkLeaderLineDirective implements OnDestroy {

  private leaderLineDraw: LeaderLineDraw;
  private subSink = new SubSink();

  private _field: BoFieldForCo;

  @Input('appLinkLeaderLine') set appLinkLeaderLine(value: BoFieldForCo) {
    this._field = value;
  }

  constructor(private coService: CoService,
              private coChangeService: CoChangeService) {
    this.listen();
  }


  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  listen(): void {
    this.subSink.sink = this.coChangeService.toggleLeaderLineSubject.asObservable()
      .subscribe(() => {
        this.leaderLineDraw = LeaderLineDraw.findByLinkFieldId(this._field.fieldId, this.coService.leaderLines);
        this.isShowLeader = !!this.leaderLineDraw;
      });
  }

  @HostBinding('class.link-leader-line') isShowLeader = false;

  @HostListener('click', ['$event'])
  remove($event: MouseEvent): any {
    $event.stopPropagation();
    $event.preventDefault();
    this.leaderLineDraw?.removeLink?.next(this._field?.fieldId);
  }

  @HostListener('mouseenter', ['$event'])
  setHoverColor($event: MouseEvent): any {
    this.leaderLineDraw?.changeColorSubject?.next({color: '#EE5252', fieldId: this._field.fieldId});
  }

  @HostListener('mouseleave', ['$event'])
  setDefaultColor($event: MouseEvent): any {
    this.leaderLineDraw?.changeColorSubject?.next({color: '#2F80ED', fieldId: this._field.fieldId});
  }
}

