import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Todo } from "../../../../services/todo/todo.interface";

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent implements OnInit {

  todo!: Todo

  @Input() set data(val: Todo) {
    this.todo = val
  }

  @Output()
  delete: EventEmitter<number> = new EventEmitter<number>()

  constructor() { }

  ngOnInit(): void {
  }

  onDelete(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.delete.emit(this.todo.id)
  }
}
