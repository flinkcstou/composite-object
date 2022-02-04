import { Pipe, PipeTransform } from '@angular/core';
import { CoService } from 'src/app/components/composite-editor/services/co.service';

@Pipe({
  name: 'findTabGroup'
})
export class FindTabGroupPipe implements PipeTransform {


  constructor(
    private readonly coService: CoService,
  ) {
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    // tslint:disable-next-line:prefer-for-of
    if (!value) {
      return;
    }
    for (const field of this.coService.tabGroupFields) {
      const tab = field.tabs.find(t => t?.id === value);
      if (!tab) {
        continue;
      }
      if (!field?.tabId) {
        return `Вкладка "${tab.label}"`;
      }

      for (const innerField of this.coService.tabGroupFields) {
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
