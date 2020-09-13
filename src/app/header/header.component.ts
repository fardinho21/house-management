import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDataObject } from '../shared/interfaces';
import { TagPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userSub : Subscription;
  tokenSub : Subscription;
  choresLinkAsHm : string = "/choresAndFloorPlan/";
  shopCalLinkAsHm : string = "/shoppingListAndCalendar/";

  isAuthed : boolean = false;
  isHouseMem : boolean = false;
  

  constructor(private authService: AuthService, private activatedRoute : ActivatedRoute, private router : Router) { 

  }

  ngOnInit(): void {

    this.userSub = this.authService.userSubject.subscribe(user => {
      this.isAuthed = !!user;
      if (user) {
        this.choresLinkAsHm = this.choresLinkAsHm + user.token;
        this.shopCalLinkAsHm = this.shopCalLinkAsHm + user.token;
      }

    });

    this.tokenSub = this.authService.tokenSubject.subscribe((data : {token:string;hmIdx:number} )=> {

      if (data) {
        this.isAuthed = true;
        this.isHouseMem = true;
        let tag = data.token + "/" + data.hmIdx;
        this.choresLinkAsHm = this.choresLinkAsHm + tag;
        this.shopCalLinkAsHm = this.shopCalLinkAsHm + tag;
      } else {
        this.isAuthed = false;
        this.isHouseMem = false;
        this.shopCalLinkAsHm = "/shoppingListAndCalendar/";
        this.choresLinkAsHm = "/choresAndFloorPlan/";

      }

    })


  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.tokenSub.unsubscribe();
  }

  logOut() {
    this.isAuthed = false;
    this.isHouseMem = false;
    this.authService.logOut();
  }

}
