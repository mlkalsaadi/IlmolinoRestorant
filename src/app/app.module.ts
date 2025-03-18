import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes: Routes = [

  { path: 'items', component: ItemsComponent }, // URL path and component
  { path: 'admin', component: AdminComponent }, // URL path and component
];
@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    AdminComponent,

  ],
  imports: [RouterModule.forRoot(routes),
    BrowserModule,ReactiveFormsModule,FormsModule,MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule // Import HttpClientModule for HTTP requests
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
