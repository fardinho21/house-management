import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Chore } from "./chore.model";
import { map, take, exhaustMap, subscribeOn, repeat } from "rxjs/operators";
import { Subject, concat } from 'rxjs';
import { HouseMember } from '../chore-list/house-member.model';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { 
  RoomObject,
  ChoresObject,
  HouseMemberObject,
  FloorPlanObject,
  ShoppingItemsObject,
  DataObject,
  EventObject,
  UserObject,
  ResponseObject } from './interfaces';
import { FloorPlan } from '../floor-plan/floor-plan.model';
import { Data } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class DatabaseManagerService {

  private API_KEY : string = "AIzaSyAyrcG6wvwGAaGp0GE1BcrxPnDsipuTWF0";
  private DATA_BASE_URL : string = "https://house-management-ffa58.firebaseio.com/";
  private TEST_DB_URL : string = "https://test1-cf6d9.firebaseio.com/";

  loadedChores: ChoresObject[] = [];
  loadedRooms: RoomObject[] = [];
  loadedEvents : EventObject[] = [];
  loadedFloorPlan : FloorPlanObject;
  loadedHouseMembers: HouseMemberObject[] = [];
  loadedId : string = "";
  
  loadedRoomsSubject = new Subject<RoomObject[]>();
  loadedChoresSubject = new Subject<ChoresObject[]>();
  loadedHouseMembersSubject = new Subject<HouseMemberObject[]>();
  loadedFloorPlanSubject = new Subject<FloorPlanObject>();
  loadedShoppingItemsSubject = new Subject<ShoppingItemsObject[]>();
  loadedEventsSubject = new Subject<EventObject[]>();
  loadedUserSubject = new Subject<User>();
  user : User = null;

  constructor(private httpClient : HttpClient, private authService : AuthService) {
    this.authService.userBehaviorSubject.subscribe(user => {
      if (user ) {
        this.user = user;
        let reg = this.user.registered ? true : false;
        if (!reg){
          this.createUser(user.username, user.id);
        } else {
          this.fetchUserData();
        }
      }

      this.loadedUserSubject.next(user);
    })
  }


  createUser(username: string, id: string) {
    this.httpClient.put<ResponseObject>(
      this.TEST_DB_URL + username + ".json",
      {id: id}
    ).subscribe(response => {
      console.log(response);
    })
  }

  fetchFloorPlan(floorPlanIndex: string) {
    this.httpClient.get<FloorPlanObject[]>(
      this.TEST_DB_URL + "floorplans.json"
    ).subscribe(floorPlans => {
      this.loadedFloorPlanSubject.next(floorPlans[+floorPlanIndex]);
    })
  }

  fetchUserData() {
    this.httpClient.get<DataObject>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {
      //console.log(response);
      this.loadedId = response.id;
      if (response.hasOwnProperty('floorPlan')) {
        
        this.loadedFloorPlan = response.floorPlan;
        this.loadedFloorPlanSubject.next(response.floorPlan);    
      }
      if (response.hasOwnProperty('houseMembers')) {
        this.loadedHouseMembers = response.houseMembers;
        this.loadedHouseMembersSubject.next(response.houseMembers);  
      } if (response.hasOwnProperty('events'))  {
        this.loadedEvents = response.events;
        this.loadedEventsSubject.next(response.events);
      }
    })
  }

  saveUserData(fp : FloorPlanObject, hmList: HouseMemberObject[]){
    
    this.httpClient.patch<FloorPlanObject>(
      this.TEST_DB_URL + this.user.username + ".json",
      {floorPlan: fp, id: this.user.id, houseMembers: hmList}
    ).subscribe(response => {
      //console.log(response)
    })
  }

  saveShoppingItems(shoppingList : ShoppingItemsObject[]) {

    this.httpClient.get<DataObject>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {

      response.shoppingItems = shoppingList;

      if(response.hasOwnProperty('shoppingItems')) {
        this.httpClient.patch<ShoppingItemsObject[]>(
          this.TEST_DB_URL + this.user.username + ".json",
          response
        ).subscribe(r => {
          //console.log(r)
        })
      } else {


        this.httpClient.put(
          this.TEST_DB_URL + this.user.username + ".json",
          response
        ).subscribe(r => {
          //console.log(r);
        })
      }

    })


  }

  fetchShoppingItems() {
    this.httpClient.get<DataObject>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {
      //console.log(response)
      if (response.hasOwnProperty('shoppingItems')) {
        this.loadedShoppingItemsSubject.next(response.shoppingItems);
      }
    })
  }

  saveEvents(events: EventObject[]) {


    //console.log(events)
    

    this.httpClient.get<DataObject>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {
      
      if (response.hasOwnProperty('events')) {
        response.events = events;
        this.httpClient.patch<EventObject[]>(
          this.TEST_DB_URL + this.user.username + ".json",
          response
        ).subscribe(res => {
          //console.log(res)
        })
      } else {
        response.events = events;
        this.httpClient.put<EventObject[]>(
          this.TEST_DB_URL + this.user.username + ".json",
          response
        ).subscribe(res => {
          //console.log(res)
        })
      }
    })
  }

  fetchEvents() {
    

    this.httpClient.get<DataObject>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {
      if (response.hasOwnProperty('events')) {
        this.loadedEvents = response.events;
        this.loadedEventsSubject.next(this.loadedEvents);
      } 
    })
  }

}
