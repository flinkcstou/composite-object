import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { DOCUMENT } from '@angular/common';
import { CoService } from 'src/app/components/services/co.service';
import { LeaderLineDrawF } from 'src/app/components/composite-editor/models/LeaderLineDraw';
import { fromEvent } from 'rxjs';

declare let LeaderLine: any;

@Directive({
  selector: '[appLeaderLine]'
})
export class LeaderLineDirective {


  private _field: CoFieldRecord = {} as CoFieldRecord;

  private lines: any[] = [];

  @Input() set appLeaderLine(value: CoFieldRecord) {
    const leaderLineDraw = LeaderLineDrawF.create(value);
    leaderLineDraw.removeSubject.subscribe((fieldId: string) => {
      this.toggleLeaderLine();
      if (this._field.links.length === 1) {
        this.coService.coFieldsSimple.splice(this.coService.coFieldsSimple.findIndex((field) => field.coFieldId === this._field.coFieldId), 1);
        this.coService.removeCoField(this._field.coFieldId);
        return;
      }
      const index = this._field.links.findIndex((link) => link.fieldId === fieldId);
      this.coService.removeLink(this._field.coFieldId, this._field.links[index]);
      this._field.links.splice(index, 1);
    });
    leaderLineDraw.changeColorSubject.subscribe((color: string) => {
      this.lines.forEach((line) => {
        line.color = color;
      });
    });
    this.coService.leaderLines.push(leaderLineDraw);

    this._field = value;
  }

  constructor(private host: ElementRef,
              @Inject(DOCUMENT) private document: Document,
              private coService: CoService,
  ) {
    const elementById = document.getElementById('firstContainerID');
    fromEvent(elementById, 'scroll').subscribe(() => {
      this.lines.forEach((line) => {
        line.position();
      });
    });
  }

  @HostListener('click', ['$event'])
  toggleLeaderLine(): void {
    this._field.showLeaderLine = !this._field.showLeaderLine;
    this.coService.leaderLineSubject.next(this._field.showLeaderLine);
    if (this._field.showLeaderLine) {
      this.showLeaderLine();
    } else {
      this.removeLeaderLine();
    }
  }

  showLeaderLine(): void {
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
            color: '#2F80ED',
            size: 3,
            hide: true
          }
        );
      }


      leaderLine.show('draw');
      this.lines.push(leaderLine);
    });
  }

  removeLeaderLine(): void {
    this.lines.forEach((line) => {
      line?.remove?.();
    });
    this.lines = [];

  }

}
