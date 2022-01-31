import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bo-attr-group',
  templateUrl: './bo-attr-group.component.html',
  styleUrls: ['./bo-attr-group.component.scss']
})
export class BoAttrGroupComponent implements OnInit {

  items = [1, 2];

  constructor() {
  }

  ngOnInit(): void {
  }

}
