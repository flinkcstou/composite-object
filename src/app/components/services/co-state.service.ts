import { Injectable } from '@angular/core';
import { CoController } from 'src/app/components/controllers/co.controller';
import { CoService } from 'src/app/components/services/co.service';

@Injectable({
  providedIn: 'root'
})
export class CoStateService {

  isChanged = false;

  constructor(private coController: CoController,
              private coService: CoService) {
  }
}
