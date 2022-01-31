import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCheckClass]'
})
export class CheckClassDirective {

  private _appToggleClass: any = {};

  @Input() set appCheckClass(value: any) {
    this._appToggleClass = value || {};
    this.setClass();
  }

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


  @HostListener('click')
  toggleClass(): void {
    this._appToggleClass.isChecked = !this._appToggleClass.isChecked;
    this.setClass();
    this.toggleEmit.emit(this._appToggleClass.isChecked);
  }

}
