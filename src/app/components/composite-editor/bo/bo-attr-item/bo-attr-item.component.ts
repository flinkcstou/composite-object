import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';
import { BoRecordWithFields } from 'src/app/components/composite-editor/models/BoRecordWithFields';
import { CoService } from 'src/app/components/services/co.service';

@Component({
  selector: 'app-bo-attr-item',
  templateUrl: './bo-attr-item.component.html',
  styleUrls: ['./bo-attr-item.component.scss']
})
export class BoAttrItemComponent implements OnInit {

  @Input() boWithFields: BoRecordWithFields | undefined;

  @Input() field: BoFieldForCo | undefined;

  private leaderLineDraw: any;

  constructor(private coService: CoService) {
    this.coService.leaderLineSubject.asObservable().subscribe((bool) => {
      this.leaderLineDraw = this.coService.leaderLines.find((leaderLine) => leaderLine.field.showLeaderLine && leaderLine.field.links.some((link) => this.field?.fieldId === link.fieldId));
      this.isShowLeader = !!this.leaderLineDraw;

    });
  }

  @HostBinding('class.show-leader') isShowLeader = false;

  ngOnInit(): void {
  }

  remove($event: MouseEvent): any {
    $event.stopPropagation();
    $event.preventDefault();
    this.leaderLineDraw?.removeSubject?.next(this.field?.fieldId);
  }

  changeColor(value: string): void {
    this.leaderLineDraw?.changeColorSubject?.next(value);
  }
}
