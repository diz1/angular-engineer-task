import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "./main-layout.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { TodoListModule } from "../../components/todo-list/todo-list.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    TodoListModule,
    MatToolbarModule,
    RouterModule
  ],
  exports: [MainLayoutComponent]
})
export class MainLayoutModule { }
