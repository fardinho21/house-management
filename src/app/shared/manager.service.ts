import { Injectable } from '@angular/core';
import { Room } from '../floor-plan/floor-plan/room.model';
import { HouseMember } from '../chore-list/chore-list/house-member.model';
import { Chore } from "../shared/chore.model";
import { Subject } from "rxjs";
import { DatabaseManagerService } from './database-manager.service';




@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  //data
  rooms: Room[] = [];
  houseMembers: HouseMember[] = []
  listOfChores : Chore[] = [];
  selectedHouseMember: HouseMember = new HouseMember("",[]);

  shoppingItems: {name: string, amount:number, requestedBy: string}[] = [
    {name:"Bread",amount:3,requestedBy: 'dummy'},
    {name:"Apple",amount:5,requestedBy: 'dummy'},
    {name:"Paper Towel",amount:1,requestedBy: 'dummy'},
  ]
  events: {title:string,start:string}[] = [
    {title:"event1",start:"2020-08-04"},
    {title:"event2",start:"2020-08-03"}
  ];

  //subjects
  roomSubject = new Subject<Room[]>();
  houseMembersSubject = new Subject<HouseMember[]>();
  shoppingItemsSubject = new Subject<{name:string,amount:number,requestedBy:string}[]>();
  selectedHouseMemberSubject = new Subject<HouseMember>();
  eventsSubject = new Subject<{title:string,start:string}[]>();

  constructor(private dataBaseManager : DatabaseManagerService) { 

    console.log(this.houseMembers);
    console.log(this.rooms);

    dataBaseManager.loadedRoomsSubject.subscribe(loaded => {
      let runningListOfRooms = []

      /**
       * this loops through all rooms from the database,
       * creates a room, creates house members (if not found),
       * and creates the chore list of the room
       */
      for (let key in loaded){

        let roomObject = loaded[key];
        let roomGeo = roomObject.room;

        let choreList = roomObject.chores.map((chore) => {
          let c = new Chore(chore.choreName, chore.done);
          let indexOfhm = this.findHouseMemberByName(chore.assignedTo);

          if (indexOfhm < 0) {
            indexOfhm = this.createHouseMember(chore.assignedTo);

            if (indexOfhm == 0){
              this.selectedHouseMember = this.houseMembers[0];
            }

          }

          c.assignToHouseMember(this.houseMembers[indexOfhm]);

          if (!c.isDone()) {
            this.houseMembers[indexOfhm].addChore(c);
          }
          

          return c;
        });

        this.listOfChores.concat(choreList.slice());

        runningListOfRooms.push(
          new Room(
            roomObject.name,
            roomGeo.xInit,
            roomGeo.yInit,
            roomGeo.width,
            roomGeo.height,
            roomObject.finishedChores,
            choreList
            ))
      }

      this.rooms = runningListOfRooms.slice();


      this.houseMembersSubject.next(this.houseMembers);
      this.roomSubject.next(this.rooms);
      this.selectedHouseMemberSubject.next(this.selectedHouseMember);

      //console.log(this.rooms);
    })

    dataBaseManager.loadedHouseMembersSubject.subscribe(loaded => {
      let runningList = []

      for (const key in loaded) {

      }

      this.houseMembers = runningList.slice();
      this.houseMembersSubject.next(this.houseMembers.slice())
      this.selectedHouseMemberSubject.next(this.houseMembers[0]);
      console.log(this.houseMembers);
    })

  }


  setRooms(rooms: Room[]){
    this.rooms = rooms;
  }

  setHouseMembers(houseMembers: HouseMember[]) {
    this.houseMembers = houseMembers;
  }

  createHouseMember(name: string) {
    this.houseMembers.push(new HouseMember(name, []));
    return this.houseMembers.length - 1;
  }

  getChores () {
    return this.listOfChores.slice();
  }
    /*
    copies the chores from each room and evenly assigns them
    */


  findHouseMemberByName(name: string) : number{

    if (this.houseMembers.length == 0) {
      return -1;
    }

    for (let i = 0; i <= this.houseMembers.length - 1; i++) {
      let hmName = this.houseMembers[i].getName();
      if (hmName == name) {
        return i;
      }
    }
    return -1;
  }
    
  getHouseMemebers() {
    return this.houseMembers.slice();
  }

  getRooms() {
    return this.rooms.slice();
  }

  findRoomByName(name : string) : number {

    if (this.rooms.length == 0) {
      return -1;
    }

    for (let i = 0; i <= this.rooms.length - 1; i++) {
      let rmName = this.rooms[i].getName();
      if (rmName == name) {
        return i;
      }
    }
    return -1;
  }

  resetRoomStatuses() {
    for (let room of this.rooms) {
      room.resetStatus();
    }
  }


  getSelected() {
    return this.selectedHouseMember;
  }
  
  onDone(chore: Chore) {
    
    chore.setDone();
    chore.getAssignedTo().removeChore(chore);
    this.houseMembersSubject.next(this.houseMembers);
    this.roomSubject.next(this.rooms);
  }
  //services for chores list and floor plan component -- end


  // services for shopping list component -- start
  getShoppingItems() {
    return this.shoppingItems.slice();
  }

  addShoppingItem(item : {name:string,amount:number,requestedBy:string}) {
    this.shoppingItems.push(item);
    this.shoppingItemsSubject.next(this.shoppingItems.slice());
  }

  deleteItem(index: number){
    this.shoppingItems.splice(index,1);
    this.shoppingItemsSubject.next(this.shoppingItems.slice());
  }

  clearShoppingList(){
    this.shoppingItems = [];
    this.shoppingItemsSubject.next(this.shoppingItems);
  }
  //services for shoppig list component -- end


  //services for calendar component -- start

  addEvent(event) {

    this.events.push(event);
    console.log(this.events);
    this.eventsSubject.next(this.events);
  }

  getEvents() {
    return this.events.slice();
  }

  deleteEvent(){

  }

  //services for calendar component -- end
}


