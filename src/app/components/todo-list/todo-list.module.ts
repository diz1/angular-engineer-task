import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListItemComponent } from "./components/todo-list-item/todo-list-item.component";
import { TodoListComponent } from "./todo-list.component";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SortByDatePipe } from "../../pipes/sort-by-date.pipe";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";

@NgModule({
  declarations: [
    TodoListComponent,
    TodoListItemComponent,
    SortByDatePipe
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatChipsModule,
  ],
  exports: [
    TodoListComponent
  ]
})
export class TodoListModule { }
