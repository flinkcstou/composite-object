import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';


@Component({
  selector: 'app-composite-editor',
  templateUrl: './composite-editor.component.html',
  styleUrls: ['./composite-editor.component.scss']
})
export class CompositeEditorComponent implements OnInit {


  // @ts-ignore
  @ViewChild('save', {read: ElementRef}) saveElement: ElementRef;

  // @ts-ignore
  @ViewChild('cancel', {read: ElementRef}) cancelElement: ElementRef;

  constructor(private coService: CoService) {
  }

  ngOnInit(): void {
    this.coService.generateFirstDraft().subscribe();
  }

}
