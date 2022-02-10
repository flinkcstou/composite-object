import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CoFieldRecord } from 'src/app/components/composite-editor/models/CoFieldRecord';
import { CoService } from 'src/app/components/services/co.service';
import { fromEvent, Observable, of } from 'rxjs';
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

  comparator = (controlValue: string): boolean => {
    return this.coService.coFieldsSimple
      .filter(x => x.coFieldId !== this.field.coFieldId)
      .map(x => x.label)
      .includes(controlValue);
  };

  saveLabel = (newValue: string) => {
    return this.coService.changeCoFieldLabel(this.field.coFieldId, newValue);
  };

  get hasField(): boolean {
    return !!this.field.coFieldId;
  }


  keyboardHandler(e: KeyboardEvent): boolean {
    const chr = String.fromCharCode(e.which);
    if ('_'.indexOf(chr) >= 0) {
      return false;
    }
  }

  onPasteLabel(e: ClipboardEvent): boolean {
    return e.clipboardData.getData('text/plain').indexOf('_') < 0;
  }

  stop($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
