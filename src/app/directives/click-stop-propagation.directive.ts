import { Directive, HostListener } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({selector: '[clickStopPropagation]'})
export class ClickStopPropagationDirective {

  @HostListener('click', ['$event'])
  onHostClick($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

}
