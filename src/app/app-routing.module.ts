// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: ItemsComponent },
  { path: '', component: AdminComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

