import { Directive, HostBinding, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {NgModel} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap, takeUntil} from 'rxjs/operators';
import {isObservable, of, Subject} from 'rxjs';
import { SubSink } from 'src/app/components/composite-editor/models/exist/SubSink';

@Directive({
  selector: 'input[appAutoSaver], textarea[appAutoSaver], quill-editor[appAutoSaver], div[appAutoSaver]',
})
export class AutoSaverDirective implements OnInit, OnDestroy {

  @Input('appAutoSaver') saverFn: (value: string, ...args: any[]) => Observable<void> | void;
  @Input('appAutoSaverArgs') args: any[] = [];
  private readonly subs = new SubSink();

  constructor(
    @Optional() private readonly ngModel: NgModel,
  ) {
    if (!ngModel) {
      throw new Error('WTKx8kBt :: appAutoSaver should be used with ngModel directive in pair');
    }
  }

  ngOnInit() {

    const value$ = new Subject<any>();
    /*
    * Нам нужно ловить только изменения которые были внесены из UI
    * Поэтому таким способом переопределяем метод который отвечает за обновление модельки
    * */
    const realViewToModelUpdate = (this.ngModel.viewToModelUpdate).bind(this.ngModel);
    this.ngModel.viewToModelUpdate = (newValue: any) => {
      realViewToModelUpdate.bind(newValue);
      value$.next(newValue);
    };

    this.subs.sink = value$.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(x => {
        const saverFnResult = this.saverFn(x, ...this.args);
        if (isObservable<void>(saverFnResult)) {
          return saverFnResult.pipe(takeUntil(value$));
        }
        return of(undefined);
      }),
    ).subscribe();

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  @HostBinding('class.invalid') get invalid(): boolean {
    return this.ngModel.invalid;
  }


}
