import { Directive, HostBinding, Input, Optional } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appAlreadyExists]',
  providers: [{provide: NG_VALIDATORS, useExisting: AlreadyExistsDirective, multi: true}],
})
export class AlreadyExistsDirective implements Validator {

  @Input('appAlreadyExists') comparator: (value: string, metadata?: any) => boolean;
  @Input() metadata: any;

  validate(control: AbstractControl): ValidationErrors | null {

    if (control.value === '' && control.value != null) {
      return null;
    }

    const bool = this.comparator(control.value, this.metadata);
    if (!bool) {
      return null;
    }


    return {appAlreadyExists: true};
  }


}
