import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-expansion-panel',
  exportAs: 'appExpansionPanel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state('in', style({overflow: 'hidden', height: '*'})),
      state('out', style({overflow: 'hidden', height: '0px'})),
      transition('in => out', animate('250ms ease-in-out')),
      transition('out => in', animate('250ms ease-in-out')),
    ]),
  ],

})
export class ExpansionPanelComponent implements OnChanges, OnInit {
  @Input() defaultExpanded = false;
  @Input() expanded = false;
  @Input() index = 0;
  animationStatus = 'out';

  constructor(
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    if (this.defaultExpanded) {
      setTimeout(this.toggle.bind(this));
    }
  }

  toggle(): void {
    this.expanded = !this.expanded;
    this.animationStatus = this.expanded ? 'in' : 'out';
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.animationStatus = this.expanded ? 'in' : 'out';
  }


}
