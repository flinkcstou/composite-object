import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  todo = [1, 2, 3, 4, 5, 6, 7];

  done = [1, 2, 3, 4, 5, 6, 7];

  chooses: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<number[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // event.container.data.splice()
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  sortPredicate(index: number, item: CdkDrag<number>): boolean {
    return false;
  }


  dropChild(event: CdkDragDrop<number[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.done = this.done.filter((item, index) => item !== event.previousContainer.data[event.previousIndex]);
    }
  }
}
