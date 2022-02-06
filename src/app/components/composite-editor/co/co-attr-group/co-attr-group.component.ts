import { Component, OnInit } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';

@Component({
  selector: 'app-co-attr-group',
  templateUrl: './co-attr-group.component.html',
  styleUrls: ['./co-attr-group.component.scss']
})
export class CoAttrGroupComponent implements OnInit {


  coWidgets: any[] = [];

  constructor(private coService: CoService) {
    this.coWidgets = this.coService.coWidgets;
  }

  ngOnInit(): void {
  }

}
