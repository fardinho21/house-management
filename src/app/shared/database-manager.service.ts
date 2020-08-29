import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Chore } from "./chore.model";
import { map, take, exhaustMap } from "rxjs/operators";
import { Subject } from 'rxjs';
import { HouseMember } from '../chore-list/house-member.model';
import { AuthService, ResponseObject, UserObject } from './auth.service';
import { User } from '../auth-page/user.model';
import { RoomObject, ChoresObject, HouseMemberObject, FloorPlanObject } from './interfaces';



@Injectable({
  providedIn: 'root'
})
export class DatabaseManagerService {

  private testRooms : RoomObject[] = 
  [
    {
      name: "room0", 
      finishedChores: 0,
      roomGeo: {xInit: 0, yInit: 0, width: 0, height: 0, status: 0},
      chores: [
        {
          choreName: "chore0", done: false, assignedTo: "", parentRoom: "room0"
        }
      ]
    }
  ]

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

  user : User;

  constructor(private httpClient : HttpClient, private authService : AuthService) {
    this.authService.userSubject.subscribe(user => {
      this.user = user;
      let reg = this.user.registered ? true : false;
      if (!reg){
        this.createUser(user.username);
      }

    })
  }

  fetchChores() {
    this.httpClient.get<ChoresObject[]>(this.TEST_DB_URL + 'chores.json')
      .pipe(map((data)=> {
        let choreArray = []
        for (const key in data){
          choreArray.push({...data[key], id:key})
        }
        return choreArray;
      }))
      .subscribe(chores => {
        this.loadedChores = chores.slice();
        this.loadedChoresSubject.next(this.loadedChores);
      });     

      
  }

  saveChores(chores: ChoresObject[]){


    this.httpClient.put<ChoresObject[]>(
      this.TEST_DB_URL + "chores.json",
      chores
    )
    .subscribe(response => {
      console.log(response);
    })
  }

  fetchHouseMembers() {
    this.httpClient.get<HouseMemberObject[]>(this.TEST_DB_URL + "house-members.json")
    .pipe(map(data => {
      let hosueMemberArray = [];
      for (const key in data) {
        hosueMemberArray.push({...data[key],id:key})
      }
      return hosueMemberArray;
    }))
    .subscribe(houseMembers => {
      this.loadedHouseMembers = houseMembers.slice();
      this.loadedHouseMembersSubject.next(this.loadedHouseMembers)
    })
  }
  
  saveHouseMembers(houseMembers: HouseMemberObject[]) {
    this.httpClient.put<HouseMemberObject[]>(
      this.TEST_DB_URL + "house-members.json",
      houseMembers
    ).subscribe(response => {
      console.log(response)
    }) 
  }

  fetchRooms() {

    this.httpClient.get<RoomObject[]>(this.TEST_DB_URL + this.user.username + ".json")
      .pipe(map((data)=> {
        let roomArray = []
        for (const key in data){
          roomArray.push({...data[key], id:key})
        }
        return roomArray;
      }))
      .subscribe(rooms => {
        this.loadedRooms = rooms.slice();
        console.log(rooms);
        this.loadedRoomsSubject.next(this.loadedRooms);
      });  
  }

  saveRooms(rooms : RoomObject[]) {
    this.httpClient.put<RoomObject>(
      this.TEST_DB_URL + this.user.username +".json",
      rooms
    )
    .subscribe(response => {
      console.log(response);
    })
  }

  createUser(username: string) {
    this.httpClient.put<ResponseObject>(
      this.TEST_DB_URL + username + ".json",
      this.testRooms
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

}
