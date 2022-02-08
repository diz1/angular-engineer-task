import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/todo-item/todo-item.module').then(m => m.TodoItemModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./components/todo-item/todo-item.module').then(m => m.TodoItemModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
