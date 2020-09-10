import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoresAndFplanComponent } from './chores-and-fplan/chores-and-fplan.component';
import { ShoplistAndCalComponent } from './shoplist-and-cal/shoplist-and-cal.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { RouteGuard } from "./shared/route.guard";

const routes: Routes = [
  {path: "", redirectTo: "authPage", pathMatch: "full"},
  {path: "choresAndFloorPlan/:token", component: ChoresAndFplanComponent, canActivate: [RouteGuard]},
  {path: "choresAndFloorPlan/:token/:id", component: ChoresAndFplanComponent},
  {path: "shoppingListAndCalendar/:token", component: ShoplistAndCalComponent, canActivate: [RouteGuard]},
  {path: "shoppingListAndCalendar/:token/:id", component: ShoplistAndCalComponent},
  {path: "authPage", component: AuthPageComponent, canActivate: [RouteGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
