import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub : Subscription;

  isAuthed : boolean = false;
  isHouseMem : boolean = false;

  constructor(private authService: AuthService, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {

    this.userSub = this.authService.userSubject.subscribe(user => {
      this.isAuthed = !!user;
    });

    this.isHouseMem = this.activatedRoute.snapshot.params['id'] ? true : false;

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
