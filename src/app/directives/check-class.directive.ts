import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, delay, filter, tap } from 'rxjs/operators';
import { DragService } from 'src/app/components/services/drag.service';
import { CoChangeService } from 'src/app/components/services/co-change.service';

@Directive({
  selector: '[appCheckClass]'
})
export class CheckClassDirective implements AfterViewInit {

  private _appToggleClass: any | StyleField = {};

  isMouseDown = false;
  isLongPress = false;

  set checked(value: boolean) {
    this._appToggleClass.isChecked = value;
  }

  get checked(): boolean {
    return this._appToggleClass.isChecked;
  }

  @Input() set appCheckClass(value: any | StyleField) {
    this._appToggleClass = value || {};
    this.setClass();
  }


  @Output() toggleEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private host: ElementRef,
              private renderer: Renderer2,
              private coChangeService: CoChangeService) {
  }


  setClass(): void {
    if (this.checked) {
      this.renderer.addClass(this.host.nativeElement, 'check');
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'check');
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.host.nativeElement, 'mouseup')
      .pipe(
        filter(() => !this.isLongPress),
        tap(() => this.unCheckClass()),
        tap(() => {
          if (!this.isMouseDown) {
            return;
          }
          this.coChangeService.calcCountCheck(this.checked);
        }),
      ).subscribe();

    fromEvent(this.host.nativeElement, 'mousedown')
      .pipe(
        tap(() => this.checkClass()),
        tap(() => {
          if (this.isMouseDown) {
            return;
          }
          this.coChangeService.calcCountCheck(this.checked);
        }),
        debounceTime(200),
        tap(() => this.setLongPress(true))
      ).subscribe();

  }


  @HostBinding('class.check') get getCheck(): boolean {
    return this.checked;
  }


  unCheckClass(): void {
    if (!this.isMouseDown) {
      return;
    }
    this.checked = !this.checked;
    this.setClass();
    this.toggleEmit.emit(this.checked);
  }

  setLongPress(value: boolean): void {
    this.isLongPress = value;
  }

  checkClass(): void {
    this.setLongPress(false);
    this.isMouseDown = this.checked;
    this.checked = true;
    this.setClass();
    this.toggleEmit.emit(this.checked);
  }

}
