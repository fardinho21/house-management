import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'house-management';

  loggedIn: boolean = true;

  constructor(router: Router, activatedRoute : ActivatedRoute, authService : AuthService) {

    let tokens = activatedRoute.snapshot.url.toString().split(',')

    if (tokens.length == 3) {
      //authService.logIn();
    }

    router.navigate(["/authPage"])
  }
}
