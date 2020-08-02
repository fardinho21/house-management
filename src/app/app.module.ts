import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FloorPlanComponent } from './floor-plan/floor-plan/floor-plan.component';
import { ChoreListComponent } from './chore-list/chore-list/chore-list.component';
import { HeaderComponent } from './header/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    FloorPlanComponent,
    ChoreListComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
