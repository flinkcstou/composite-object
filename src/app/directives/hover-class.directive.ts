import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverClass]'
})
export class HoverClassDirective {

  constructor(private host: ElementRef,
              private renderer: Renderer2) {
  }


  @HostListener('mouseenter') onMouseEnter(): void {
    this.renderer.addClass(this.host.nativeElement, 'hover');
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.renderer.removeClass(this.host.nativeElement, 'hover');
  }
}
