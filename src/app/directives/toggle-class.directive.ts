import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggleClass]',
  exportAs: 'toggleClass'
})
export class ToggleClassDirective {

  private _appToggleClass: any = {};
  @Input() set appToggleClass(value: any) {
    this._appToggleClass = value;
    this.setClass();
  }

  @Output() toggleEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private host: ElementRef,
              private renderer: Renderer2) {
  }


  setClass(): void {
    if (this._appToggleClass.isExpand) {
      this.renderer.addClass(this.host.nativeElement, 'expand');
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'expand');

    }
  }


  @HostListener('click', ['$event'])
  toggleClass($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this._appToggleClass.isExpand = !this._appToggleClass.isExpand;
    this.setClass();
    this.toggleEmit.emit(this._appToggleClass.isExpand);
  }


}
