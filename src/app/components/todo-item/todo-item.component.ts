import { Component, ChangeDetectionStrategy, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, iif, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { TodoService } from "../../services/todo/todo.service";
import { Todo } from "../../services/todo/todo.interface";
import { MatSnackBar } from "@angular/material/snack-bar";

export type EditableContent = 'title' | 'description'

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnDestroy, AfterViewInit {
  componentDestroyed$: Subject<boolean> = new Subject<boolean>()
  todo$: Subject<Todo | null> = new Subject<Todo | null>()
  canEditTitle = false
  canEditDescription = false

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private cdr: ChangeDetectorRef,
    private snackbarService: MatSnackBar
  ) { }

  public editContent(inputRef: HTMLInputElement | HTMLTextAreaElement, type: EditableContent): void {
    this.switchEditableContentStatus(type, true)
    setTimeout(() => {
      inputRef.focus()
    })
  }

  private switchEditableContentStatus(type: EditableContent, status: boolean) {
    if (type === "title") {
      this.canEditTitle = status
    }

    if (type === "description") {
      this.canEditDescription = status
    }

    this.cdr.markForCheck()
  }

  public renameTodo({ target }: FocusEvent, type: EditableContent): void {
    const newContent = (target as HTMLInputElement).value
    const currentTodoId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') ?? '', 10)

    this.todoService.renameTodo(currentTodoId, newContent, type)
      ?.pipe(
        tap(() => {
          this.snackbarService.open(`Success renamed note ${currentTodoId}`, 'close')
          this.switchEditableContentStatus(type, false)
        }),
        catchError(e => {
          this.snackbarService.open(`Failed to rename note ${currentTodoId}`, 'close')
          this.switchEditableContentStatus(type, false)
          return of(e)
        })
      )
      .subscribe()
  }

  public ngAfterViewInit() {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) =>
          iif(
            () => !!params.get('id'),
            this.todoService.getTodo(parseInt(params.get('id') as string, 10)),
            of(null)
          )
        ),
        tap(todo => {
          this.todo$.next(todo)
          this.cdr.detectChanges()
          if (!todo) {
            void this.router.navigate(['/'])
          }
        }),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe()
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
