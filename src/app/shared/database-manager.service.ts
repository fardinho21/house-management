import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Chore } from "./chore.model";
import { map, take, exhaustMap, subscribeOn, repeat } from "rxjs/operators";
import { Subject, concat } from 'rxjs';
import { HouseMember } from '../chore-list/house-member.model';
import { AuthService, ResponseObject, UserObject } from './auth.service';
import { User } from './user.model';
import { RoomObject, ChoresObject, HouseMemberObject, FloorPlanObject, ShoppingItemsObject, DataObject } from './interfaces';
import { FloorPlan } from '../floor-plan/floor-plan.model';



@Injectable({
  providedIn: 'root'
})
export class DatabaseManagerService {

  private testRooms = {
    dummyData: "dummy"
  };

  private API_KEY : string = "AIzaSyAyrcG6wvwGAaGp0GE1BcrxPnDsipuTWF0";
  private DATA_BASE_URL : string = "https://house-management-ffa58.firebaseio.com/";
  private TEST_DB_URL : string = "https://test1-cf6d9.firebaseio.com/";

  loadedChores: ChoresObject[] = [];
  loadedRooms: RoomObject[] = [];
  
  loadedHouseMembers: HouseMemberObject[] = [];
  loadedRoomsSubject = new Subject<RoomObject[]>();
  loadedChoresSubject = new Subject<ChoresObject[]>();
  loadedHouseMembersSubject = new Subject<HouseMemberObject[]>();
  loadedFloorPlanSubject = new Subject<FloorPlanObject>();
  loadedShoppingItemsSubject = new Subject<ShoppingItemsObject[]>();

  user : User;

  constructor(private httpClient : HttpClient, private authService : AuthService) {
    this.authService.userSubject.subscribe(user => {
      this.user = user;
      let reg = this.user.registered ? true : false;
      if (!reg){
        this.createUser(user.username, user.id);
      } else {
        this.fetchUserData();
      }
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
    this.httpClient.get<{id: string; floorPlan: FloorPlanObject; houseMembers: HouseMemberObject[]}>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {
      console.log(response);
      if (response.hasOwnProperty('floorPlan')) {
        this.loadedFloorPlanSubject.next(response.floorPlan);    
      }
      if (response.hasOwnProperty('houseMembers')) {
        this.loadedHouseMembersSubject.next(response.houseMembers);  
      }
    })
  }

  saveUserData(fp : FloorPlanObject, hmList: HouseMemberObject[]){
    
    this.httpClient.patch<FloorPlanObject>(
      this.TEST_DB_URL + this.user.username + ".json",
      {floorPlan: fp, id: this.user.id, houseMembers: hmList}
    ).subscribe(response => {
      console.log(response)
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
          console.log(r)
        })
      } else {


        this.httpClient.put(
          this.TEST_DB_URL + this.user.username + ".json",
          response
        ).subscribe(r => {
          console.log(r);
        })
      }

    })


  }

  fetchShoppingItems() {
    this.httpClient.get<DataObject>(
      this.TEST_DB_URL + this.user.username + ".json"
    ).subscribe(response => {
      console.log(response)
      if (response.hasOwnProperty('shoppingItems')) {
        this.loadedShoppingItemsSubject.next(response.shoppingItems);
      }
    })
  }

}
