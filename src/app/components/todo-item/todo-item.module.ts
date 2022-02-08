import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from "./todo-item.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDividerModule } from "@angular/material/divider";
import { RouterModule, Routes} from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

const routes: Routes = [{
  path: '',
  component: TodoItemComponent
}]

@NgModule({
  declarations: [TodoItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [TodoItemComponent]
})
export class TodoItemModule { }
