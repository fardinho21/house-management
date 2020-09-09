import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, UserObject, ResponseObject } from '../shared/auth.service'
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit {

  mode : string = "login";
  isLoading : boolean = false;
  errorMessage : string;

  constructor(private authService: AuthService, private router: Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.snapshot.params['mike']

  }

  switchMode() {
    this.mode = this.mode == 'login' ? 'signup' : 'login';
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    let user : UserObject = {
      email: form.value.username + "@house-manage.com",
      password: form.value.password,
      returnSecureToken: true
    }
    
    let authObservable : Observable<ResponseObject>;

    this.isLoading = true;
    if (this.mode == 'login') {
      //.. login
      authObservable = this.authService.logIn(user)
    } else  {
      //.. sign up
      authObservable =this.authService.signUp(user)
    }

    authObservable.subscribe(response => {
      console.log(response);
      
      this.router.navigate(['/choresAndFloorPlan/' + response.email.split('@')[0] ])
      this.isLoading = false;
    }, errorMsg => {
      this.errorMessage = errorMsg;
      this.isLoading = false;
    })

    form.reset();

  }


}
