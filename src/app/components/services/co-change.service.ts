import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoChangeService {


  public toggleBoSubject: Subject<string> = new Subject<string>();
  public removeBoSubject: Subject<string> = new Subject<string>();
  public leaderLineSubject: Subject<string> = new Subject();
  public removeCoFieldSubject: Subject<string> = new Subject<string>();


  constructor() {
  }


}