import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoChangeService {


  public toggleBoSubject: Subject<string> = new Subject<string>();
  public toggleWidgetSubject: Subject<string> = new Subject<string>();
  public removeBoSubject: Subject<string> = new Subject<string>();
  public toggleLeaderLineSubject: Subject<string> = new Subject();
  public removeCoFieldSubject: Subject<string> = new Subject<string>();

  public countCheckBehavior: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  constructor() {
  }

  calcCountCheck(bool: boolean, isClear: boolean = false): void {
    if (isClear) {
      this.countCheckBehavior.next(0);
      return;
    }
    if (bool == null) {
      return;
    }
    const count = Number(!!bool) || -1;
    const value = count + this.countCheckBehavior.value;
    this.countCheckBehavior.next(value);
  }


}
