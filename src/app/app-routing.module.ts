import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoresAndFplanComponent } from './chores-and-fplan/chores-and-fplan.component';
import { ShoplistAndCalComponent } from './shoplist-and-cal/shoplist-and-cal.component';
import { AuthPageComponent } from './auth-page/auth-page.component';


const routes: Routes = [
  {path: "", redirectTo: "authPage", pathMatch: "full"},
  {path: "choresAndFloorPlan", component: ChoresAndFplanComponent} ,
  {path: "shoppingListAndCalendar", component: ShoplistAndCalComponent} ,
  {path: "authPage", component: AuthPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
