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
import { ShoppingListComponent } from './shopping-list/shopping-list/shopping-list.component';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { ChoresAndFplanComponent } from './chores-and-fplan/chores-and-fplan.component';
import { ShoplistAndCalComponent } from './shoplist-and-cal/shoplist-and-cal.component';
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { DatabaseManagerService } from './shared/database-manager.service';
import { HttpClientModule } from "@angular/common/http";

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    FloorPlanComponent,
    ChoreListComponent,
    HeaderComponent,
    CamelToSpacePipe,
    ShoppingListComponent,
    CalendarComponent,
    ChoresAndFplanComponent,
    ShoplistAndCalComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FullCalendarModule,
    HttpClientModule
  ],
  providers: [ManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
