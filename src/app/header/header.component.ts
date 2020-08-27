import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub : Subscription;

  isAuthed : boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.userSub = this.authService.userSubject.subscribe(user => {
      this.isAuthed = !!user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
