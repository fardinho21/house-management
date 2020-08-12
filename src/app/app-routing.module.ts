import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoresAndFplanComponent } from './chores-and-fplan/chores-and-fplan.component';
import { ShoplistAndCalComponent } from './shoplist-and-cal/shoplist-and-cal.component';


const routes: Routes = [
  {path: "", redirectTo: "choresAndFloorPlan", pathMatch: "full"},
  {path: "choresAndFloorPlan", component: ChoresAndFplanComponent} ,
  {path: "shoppingListAndCalendar", component: ShoplistAndCalComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
