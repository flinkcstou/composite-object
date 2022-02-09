import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attr-drag-preview',
  templateUrl: './attr-drag-preview.component.html',
  styleUrls: ['./attr-drag-preview.component.scss']
})
export class AttrDragPreviewComponent implements OnInit {

  @Input() preview: {isScope: boolean, label: string } = {} as any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
