import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/components/services/lib/http.service';
import { BoRecord } from 'src/app/components/composite-editor/models/BoRecord';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoController {


  constructor(private http: HttpService) {
    this.http = http.setControllerPrefix('business-objects');
    this.setToken(environment.token);
  }

  setToken(token: string): void {
    this.http.token = token;
  }

  loadBoRecordsForDrag(): Observable<BoRecord[]> {
    return this.http.post<BoRecord[]>('/load-bo-records-for-drag', {})
      .pipe(map(response => response.body)) as Observable<BoRecord[]>;
  }
}
