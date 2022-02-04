import { Pipe, PipeTransform } from '@angular/core';
import { CoService } from 'src/app/components/services/co.service';
import { BoFieldForCo } from 'src/app/components/composite-editor/models/BoFieldForCo';

@Pipe({
  name: 'findTabGroup'
})
export class FindTabGroupPipe implements PipeTransform {


  constructor(
    private readonly coService: CoService,
  ) {
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    const fields = args[0] as BoFieldForCo[];
    if (!value) {
      return;
    }
    for (const field of fields) {
      const tab = field.tabs.find(t => t?.id === value);
      if (!tab) {
        continue;
      }
      if (!field?.tabId) {
        return `Вкладка "${tab.label}"`;
      }

      for (const innerField of fields) {
        const innerTab = innerField.tabs.find(t => t?.id === tab?.id);
        if (!innerField?.tabId) {
          continue;
        }
        return `Вкладка "${innerTab.label}" --> "${tab.label}"`;
      }

      return `Вкладка "${tab.label}"`;
    }
    return null;
  }

}
