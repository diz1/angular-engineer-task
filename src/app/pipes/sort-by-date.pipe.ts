import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from "../services/todo/todo.interface";

export type Directions = 'ASC' | 'DESC'

@Pipe({
  name: 'sortByDate'
})
export class SortByDatePipe implements PipeTransform {

  transform(array: Array<Todo>, direction: Directions): Array<Todo> {
    switch (direction) {
      case 'ASC':
        return array.sort((prev, next) => prev.date > next.date ? 1 : -1);
      case 'DESC':
        return array.sort((prev, next) => next.date > prev.date ? 1 : -1);
      default:
        return array
    }
  }

}
