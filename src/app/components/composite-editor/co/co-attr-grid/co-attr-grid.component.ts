import { Component, Input, OnInit } from '@angular/core';
import { CoWidget } from 'src/app/components/composite-editor/models/CoWidget';
import { CoWidgetType } from 'src/app/components/composite-editor/models/CoWidgetType';

@Component({
  selector: 'app-co-attr-grid',
  templateUrl: './co-attr-grid.component.html',
  styleUrls: ['./co-attr-grid.component.scss']
})
export class CoAttrGridComponent implements OnInit {

  // @ts-ignore
  @Input() coWidget: CoWidget;
  CoWidgetType = CoWidgetType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
