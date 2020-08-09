import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChoreListComponent } from './chore-list/chore-list/chore-list.component';
import { FloorPlanComponent } from './floor-plan/floor-plan/floor-plan.component';
import { HeaderComponent } from './header/header/header.component';
import { CamelToSpacePipe } from './shared/camel-to-space.pipe';
import { ManagerService } from './shared/manager.service';
import { FormsModule } from "@angular/forms";


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
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [ManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
