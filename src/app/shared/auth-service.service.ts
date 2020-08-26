import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Subject } from "rxjs";
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

  user = new Subject<User>();

  private API_KEY : string = "AIzaSyA0pQaKfDFU2GxbCVXBsyHS9kKASZX188w";
  private SIGN_UP_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  private LOG_IN_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="

  constructor(private httpClient : HttpClient ) { }

  signUp(user: UserObject) {
    return this.httpClient.post<ResponseObject>(
      this.SIGN_UP_URL + this.API_KEY,
      user
    ).pipe(catchError(this.handleError));
  }

  logIn(user: UserObject){
    return this.httpClient.post<ResponseObject>(
      this.LOG_IN_URL + this.API_KEY,
      user
    ).pipe(catchError(this.handleError))
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

}
