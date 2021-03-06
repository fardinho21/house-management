import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ManagerService } from "./manager.service";
import { Chore } from "./chore.model";
import { map } from "rxjs/operators";
import { Subject } from 'rxjs';



export interface RoomObject {
  name: string;
  finishedChores: number;
  room: {xInit: number ; yInit: number; width: number; height: number; status: number};
  chores: {
    choreName: string; 
    done: boolean; 
    assignedTo: string;
    parentRoom: string
  }[]
}

export interface ChoresObject {
  choreName: string;
  done: boolean; 
  assignedTo: string;
  parentRoom: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseManagerService {

  private API_KEY : string = "AIzaSyA0pQaKfDFU2GxbCVXBsyHS9kKASZX188w ";

  private DATA_BASE_URL : string = "https://house-management-ffa58.firebaseio.com/"

  constructor(private httpClient : HttpClient) { }

  loadedChores: ChoresObject[] = [];

  loadedRooms: RoomObject[] = [];

  loadedRoomsSubject = new Subject<RoomObject[]>();

  loadedChoresSubject = new Subject<ChoresObject[]>();

  fetchChores() {
    this.httpClient.get<ChoresObject[]>(this.DATA_BASE_URL + 'chores.json')
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
      this.DATA_BASE_URL + "chores.json",
      chores
    )
    .subscribe(response => {
      console.log(response);
    })
  }

  fetchHouseMembers() {

  }

  saveHouseMembers() {

  }

  fetchRooms() {
    this.httpClient.get<RoomObject[]>(this.DATA_BASE_URL + 'rooms.json')
      .pipe(map((data)=> {
        let roomArray = []
        for (const key in data){
          roomArray.push({...data[key], id:key})
        }
        return roomArray;
      }))
      .subscribe(rooms => {
        this.loadedRooms = rooms.slice();
        this.loadedRoomsSubject.next(this.loadedRooms);
      });  
  }

  saveRooms(rooms : RoomObject[]) {
    this.httpClient.put<RoomObject>(
      this.DATA_BASE_URL + "rooms.json",
      rooms
    )
    .subscribe(response => {
      console.log(response);
    })
  }

}
