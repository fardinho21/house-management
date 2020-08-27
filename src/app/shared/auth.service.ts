import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "../auth-page/user.model";

export interface UserObject{
  email: string;
  password: string;
  returnSecureToken: true;
}

export interface ResponseObject {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject = new BehaviorSubject<User>(null);
  token : string = null;

  private API_KEY : string = "AIzaSyAyrcG6wvwGAaGp0GE1BcrxPnDsipuTWF0";
  private SIGN_UP_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  private LOG_IN_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="

  constructor(private httpClient : HttpClient ) { }

  signUp(user: UserObject) {
    return this.httpClient.post<ResponseObject>(
      this.SIGN_UP_URL + this.API_KEY,
      user
    ).pipe(catchError(this.handleError), tap(response => {
      this.handleAuthentication(response);
    }));
  }

  logIn(user: UserObject){
    return this.httpClient.post<ResponseObject>(
      this.LOG_IN_URL + this.API_KEY,
      user
    ).pipe(catchError(this.handleError), tap(response => {
      this.handleAuthentication(response);
    }));
  }

  private handleError(errorRes: HttpErrorResponse) {
    
    let errorMessage = "An unknown error!"

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "Email is already registered!";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "Invalid password!";
        break
      case "EMAIL_NOT_FOUND":
        errorMessage = "Email is not registered!";
        break;
    }

    return throwError(errorMessage);

  }

  private handleAuthentication(response: ResponseObject ) {
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn);
    const user = new User(
      response.email, 
      response.localId, 
      response.idToken, 
      expirationDate);

    this.userSubject.next(user);
  }

}
