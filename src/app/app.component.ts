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

    authService.tokenSubject.subscribe(accountInfo => {
      //if (  ) 
    })

    let tokens = window.location.href.split('/');

    if (tokens.length == 6){
      authService.getAccountInfo(tokens[4], +tokens[5]);
    } else {
      router.navigate(["/authPage"])
    }

    
  }
}
