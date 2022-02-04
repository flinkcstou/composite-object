import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpService } from 'src/app/components/services/lib/http.service';

@NgModule({imports: [CommonModule, HttpClientModule]})
export class HttpServiceModule {

  static forRoot(urlPrefix: string, apiPrefix: string): ModuleWithProviders<HttpServiceModule> {
    return {
      ngModule: HttpServiceModule,
      providers: [
        {
          provide: HttpService,
          deps: [HttpClient],
          useFactory: (http: HttpClient) => new HttpService(http, urlPrefix, apiPrefix),
        },
      ],
    };
  }

}
