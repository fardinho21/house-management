import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FloorPlanComponent } from './floor-plan/floor-plan/floor-plan.component';
import { ChoreListComponent } from './chore-list/chore-list/chore-list.component';
import { HeaderComponent } from './header/header/header.component';
import { ManagerService } from './shared/manager.service';
import { CamelToSpacePipe } from './shared/camel-to-space.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FloorPlanComponent,
    ChoreListComponent,
    HeaderComponent,
    CamelToSpacePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
