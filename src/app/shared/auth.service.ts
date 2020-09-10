import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject, Subject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { DatabaseManagerService } from './database-manager.service';
import { UserObject, ResponseObject, AccountDataObject } from "../shared/interfaces";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userBehaviorSubject = new BehaviorSubject<User>(null);
  userSubject = new Subject<User>();
  tokenSubject = new Subject<{token:string;hmIdx?:number}>();
  token : string = null;
  isHouseMember : boolean = false;

  private API_KEY : string = "AIzaSyAyrcG6wvwGAaGp0GE1BcrxPnDsipuTWF0";
  private SIGN_UP_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  private LOG_IN_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  private LOOK_UP_URL : string = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="

  constructor(private httpClient : HttpClient) { }

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
      //console.log(response)
      this.handleAuthentication(response);
    }));
  }

  getAccountInfo(idToken : string, hMidx : number) {
    this.httpClient.post<any>(
      this.LOOK_UP_URL + this.API_KEY,
      {idToken: idToken}
    ).subscribe(response => {

      const userData = response.users[0]

      let accData : AccountDataObject = {
        email: userData.email,
        localId: userData.localId,
        tokenId: idToken,
        expiresIn: 6000000,
        houseMemberIndex: hMidx
      }

      this.logInAsHouseMember(accData);
    })
  }

  private logInAsHouseMember(accountData : AccountDataObject) {
    const expirationDate = new Date(new Date().getTime() + +accountData.expiresIn);
    let user = new User (
      accountData.email,
      accountData.localId,
      accountData.tokenId,
      expirationDate);

    user.registered = true;
    user.houseMemberIndex = accountData.houseMemberIndex;
    this.isHouseMember = true;
    this.userSubject.next(user);
    this.userBehaviorSubject.next(user);
    this.tokenSubject.next({token: accountData.tokenId, hmIdx: accountData.houseMemberIndex });
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
    let regi = response.registered;
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn);
    const user = new User(
      response.email, 
      response.localId, 
      response.idToken, 
      expirationDate);

    user.registered = regi ? true : false;
    this.userSubject.next(user);
    this.userBehaviorSubject.next(user)
  }

}
