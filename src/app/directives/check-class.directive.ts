import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { StyleField } from 'src/app/components/composite-editor/models/StyleField';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, delay, filter, tap } from 'rxjs/operators';

@Directive({
  selector: '[appCheckClass]'
})
export class CheckClassDirective implements AfterViewInit {

  private _appToggleClass: any | StyleField = {};

  @Input() set appCheckClass(value: any | StyleField) {
    this._appToggleClass = value || {};
    this.setClass();
  }

  isMouseDown = false;
  isLongPress = false;

  @Output() toggleEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private host: ElementRef,
              private renderer: Renderer2) {
  }


  setClass(): void {
    if (this._appToggleClass.isChecked) {
      this.renderer.addClass(this.host.nativeElement, 'check');
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'check');

    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.host.nativeElement, 'mouseup')
      .pipe(
        filter(() => !this.isLongPress),
        tap(() => this.unCheckClass())
      ).subscribe();

    fromEvent(this.host.nativeElement, 'mousedown')
      .pipe(
        tap(() => this.checkClass()),
        debounceTime(200),
        tap(() => this.setLongPress(true))
      ).subscribe();

  }


  @HostBinding('class.check') get getCheck(): boolean {
    return this._appToggleClass.isChecked;
  }


  unCheckClass(): void {
    if (!this.isMouseDown) {
      return;
    }
    this._appToggleClass.isChecked = !this._appToggleClass.isChecked;
    this.setClass();
    this.toggleEmit.emit(this._appToggleClass.isChecked);
  }

  setLongPress(value: boolean): void {
    this.isLongPress = value;
  }

  checkClass(): void {
    this.setLongPress(false);
    this.isMouseDown = this._appToggleClass.isChecked;
    this._appToggleClass.isChecked = true;
    this.setClass();
    this.toggleEmit.emit(this._appToggleClass.isChecked);
  }

}
