import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bo-attr-grid',
  templateUrl: './bo-attr-grid.component.html',
  styleUrls: ['./bo-attr-grid.component.scss']
})
export class BoAttrGridComponent implements OnInit {

  items: any[] = [{}, {}, {}, {}];
  boItem = {
    isExpand: false
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
