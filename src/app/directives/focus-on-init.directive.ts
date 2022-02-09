import {AfterViewInit, Directive, Input, ViewContainerRef} from '@angular/core';

@Directive({ selector: '[appFocusOnInit]' })
export class FocusOnInitDirective implements AfterViewInit {

  @Input() appFocusOnInit = false;

  constructor(private vcRef: ViewContainerRef) { }

  ngAfterViewInit(): void {
    if (this.appFocusOnInit) {
      setTimeout(() => { this.vcRef.element.nativeElement.focus(); }, 0);
    }
  }

}
