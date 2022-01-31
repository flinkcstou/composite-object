import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bo-attr-grid',
  templateUrl: './bo-attr-grid.component.html',
  styleUrls: ['./bo-attr-grid.component.scss']
})
export class BoAttrGridComponent implements OnInit {

  items = [1, 2, 3, 4];
  boItem = {
    isExpand: false
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
