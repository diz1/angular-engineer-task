import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, Observable, tap } from "rxjs";
import { Todo }  from "./todo.interface";
import { EditableContent } from "../../components/todo-item/todo-item.component";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: BehaviorSubject<Array<Todo>> = new BehaviorSubject<Array<Todo>>(JSON.parse(localStorage.getItem('todos') ?? '[]'))

  get todos$(): Observable<Array<Todo>> {
    return this.todos.asObservable()
  }

  get tags$(): Observable<Array<string>> {
    const searchRegExp = /#[А-Яа-я]+|#\w+/gm

    return this.todos.asObservable()
      .pipe(
        map(todos => todos.map(todo => {
          return todo.description.match(searchRegExp)
        })),
        map(tags => {
          const res: Array<string> = []

          tags.forEach((tagArr) => {
            tagArr?.forEach(tag => {
              res.push(tag)
            })
          })

          return res
        })
      )
  }

  constructor() { }

  public deleteTodo(id: number): Observable<Array<Todo>> {
    return this.todos
      .pipe(
        first(),
        map(todos => todos.filter(todo => todo.id !== id)),
        tap((todos) => {
          this.saveTodos(todos)
        }),
      )
  }

  public getTodo(id: number): Observable<Todo | null> {
    return this.todos
      .pipe(map(todos => todos.find(todo => todo.id === id) ?? null))
  }

  public renameTodo(id: number, content: string, type: EditableContent): Observable<Array<Todo>> | undefined {
    return this.todos
      .pipe(
        first(),
        tap(todos => {
          const todoToEdit = todos.find(t => t.id === id)

          if (todoToEdit) {
            todoToEdit[type] = content && content.trim() ? content : type === 'description' ? 'Описание заметки' : 'Новая заметка'
            todoToEdit.date = Date.parse((new Date()).toString())

            const filteredTodos = todos.filter(t => t.id !== id)
            const newTodos = [ ...filteredTodos, todoToEdit ]

            this.saveTodos(newTodos)
          }
        })
      )
  }

  public addTodo(todo: Todo): Observable<Array<Todo>> {
    return this.todos
      .pipe(
        first(),
        tap(todos => {
          const todosById = todos.sort((a, b) => a.id > b.id ? 1 : -1)
          const newTodoId = (todosById[todosById.length - 1]?.id ?? 0) + 1

          const todoToAdd = {
            ...todo,
            id: newTodoId
          }

          const newTodos = [...todos, todoToAdd]

          this.saveTodos(newTodos)
        })
      )
  }

  private saveTodos(todos: Array<Todo>): void {
    this.todos.next(todos)
    localStorage.setItem('todos', JSON.stringify(todos))
  }
}
