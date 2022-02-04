import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconResolver((name, namespace) => {
      const url = `assets/icons/${namespace ? namespace + '/' : ''}${name}.svg?_=sySCc1KfV9`;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    });

  }
}


// @ts-ignore
export const logAndReturnEmpty: (err) => Observable<never> = err => {
  console.error(err);
  return EMPTY;
};

// @ts-ignore
export const safeObserve: <T>(observable: Observable<T>, catcher?: (err) => Observable<T>) => Observable<T>
  // @ts-ignore
  = <T>(observable: Observable<T>, catcher: (err) => Observable<T> = logAndReturnEmpty) => observable.pipe(catchError(catcher));
