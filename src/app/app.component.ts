import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'composite-object';

  constructor(private matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconResolver((name, namespace) => {
      const url = `assets/icons/${namespace ? namespace + '/' : ''}${name}.svg?_=sySCc1KfV9`;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    });

  }
}
