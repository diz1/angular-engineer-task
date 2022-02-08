import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TodoService } from "../../services/todo/todo.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of, Subject,
  switchMap,
  take,
  tap,
  timer
} from "rxjs";
import { Todo } from "../../services/todo/todo.interface";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  searchField: FormControl = new FormControl('')
  addDisabled$: Subject<boolean> = new Subject<boolean>()
  bufferedTodos$: BehaviorSubject<Array<Todo>> = new BehaviorSubject<Array<Todo>>([])
  todos$: BehaviorSubject<Array<Todo>> = new BehaviorSubject<Array<Todo>>([])

  constructor(
    public todoService: TodoService,
    private snackbarService: MatSnackBar
  ) { }

  public ngOnInit(): void {
    this.todoService.todos$
      .pipe(
        tap(todos => this.todos$.next(todos))
      )
      .subscribe()

    this.searchField.valueChanges
      .pipe(
        // if async data
        // debounceTime(300),
        // distinctUntilChanged((prev, curr) => prev.trim() === curr.trim()),
        switchMap(searchFieldValue =>
          combineLatest([this.bufferedTodos$, this.todos$])
            .pipe(
              take(1),
              map(([bufferedTodos, todos]) => ([searchFieldValue, bufferedTodos, todos]))
            )
        ),
        tap(([searchFieldValue, bufferedTodos, todos]) => {
          const hasBuffer = !!bufferedTodos.length

          if (!hasBuffer) {
            this.bufferedTodos$.next(todos)
          }
          if (!searchFieldValue) {
            this.todos$.next(bufferedTodos)
            this.bufferedTodos$.next([])
            return
          }

          const filteredTodos =
            (hasBuffer ? bufferedTodos : todos)
              .filter(
                (t: Todo) =>
                  t.title.toLowerCase().indexOf(searchFieldValue.toLowerCase()) >= 0 ||
                  t.description.toLowerCase().indexOf(searchFieldValue.toLowerCase()) >= 0 ||
                  t.id.toString().indexOf(searchFieldValue.toLowerCase()) >= 0
              )

          this.todos$.next(filteredTodos)
        })
      )
      .subscribe()
  }

  public deleteTodo(id: number): void {
    this.todoService.deleteTodo(id)
      .pipe(
        tap(() => {
          this.snackbarService.open(
            `Success deleted note ${id}`,
            'close'
          )
        }),
        catchError((e) => {
          this.snackbarService.open(
            `Error while deleting note ${id}`,
            'close'
          )
          return of(e)
        })
      )
      .subscribe()
  }

  public clearSearch(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.searchField.setValue('')
  }

  public addTodo(): void {
    this.addDisabled$.next(true)
    const fillTodo: Todo = {
      id: 0,
      date: Date.parse((new Date()).toString()),
      title: 'Новая заметка',
      description: 'Описание заметки'
    }

    this.todoService.addTodo(fillTodo)
      .pipe(
        switchMap(() => timer(1000)),
        tap(() => this.addDisabled$.next(false))
      )
      .subscribe()
  }
}
