import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EditingService } from 'src/app/components/services/editing.service';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})
export class EditingComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute,
              private editingService: EditingService) {
  }

  ngOnInit(): void {

    this.route.params.pipe(
      switchMap((id) => this.editingService.loadBoRecords('EqAm2hoCWHtTaDJg')),
      switchMap(id => this.editingService.loadBusinessObject(id)),
    ).subscribe();
  }


}
