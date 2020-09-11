import { Injectable } from '@angular/core';
import { Room } from '../floor-plan/room.model';
import { HouseMember } from '../chore-list/house-member.model';
import { Chore } from "../shared/chore.model";
import { Subject } from "rxjs";
import { DatabaseManagerService } from './database-manager.service';
import { User } from './user.model';
import { FloorPlan } from '../floor-plan/floor-plan.model';
import { ShoppingItemsObject, EventObject } from './interfaces';
import { RouteConfigLoadEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  //data
  floorPlan: FloorPlan = null;
  rooms: Room[] = [];
  houseMembers: HouseMember[] = []
  listOfChores : Chore[] = [];
  shoppingItems : ShoppingItemsObject[] = [];
  selectedHouseMember: HouseMember = new HouseMember("",[]);
  user : User = null;


  events: EventObject[] = [

  ];

  //subjects
  roomSubject = new Subject<Room[]>();
  houseMembersSubject = new Subject<HouseMember[]>();
  shoppingItemsSubject = new Subject<ShoppingItemsObject[]>();
  selectedHouseMemberSubject = new Subject<HouseMember>();
  eventsSubject = new Subject<EventObject[]>();
  floorPlanSubject = new Subject<FloorPlan>();

  constructor(private dataBaseManager : DatabaseManagerService) { 

    //console.log(this.houseMembers);
    //console.log(this.rooms);

    this.dataBaseManager.loadedRoomsSubject.subscribe(loaded => {
      let runningListOfRooms = []

      for (let key in loaded){

        let roomObject = loaded[key];
        let roomGeo = roomObject.roomGeo;

        let choreList = roomObject.chores.map((chore) => {
          let c = new Chore(chore);
          let indexOfhm = this.findHouseMemberByName(chore.assignedTo);

          if (indexOfhm < 0) {
            indexOfhm = this.createHouseMember(chore.assignedTo);

            if (indexOfhm == 0){
              this.selectedHouseMember = this.houseMembers[0];
            }

          }

          c.assignToHouseMember(this.houseMembers[indexOfhm].getName());

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
            roomGeo.status,
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

    this.dataBaseManager.loadedHouseMembersSubject.subscribe(loaded => {



      let runningList : HouseMember[] = loaded.map(hm => {

        let houseMem = new HouseMember(hm.name, [])

        for (let chore of this.listOfChores) {
          let assignedTo = chore.getAssignedTo()
          let done = chore.isDone();

          if ( assignedTo == "name" || done ) {
            continue;
          }
          
          if (assignedTo == hm.name) {
              houseMem.addChore(chore);
          }
        }

        return houseMem;

      })

      this.houseMembers = runningList.slice();
      this.houseMembersSubject.next(this.houseMembers.slice())
      this.selectedHouseMemberSubject.next(this.houseMembers[0]);
      //console.log(this.houseMembers);
    })

    this.dataBaseManager.loadedFloorPlanSubject.subscribe(loaded => {
      this.setFloorPlan( new FloorPlan(loaded) );
      this.floorPlanSubject.next(this.floorPlan);
    })

    this.dataBaseManager.loadedShoppingItemsSubject.subscribe(loaded => {
      this.shoppingItems = loaded;
      this.shoppingItemsSubject.next(this.shoppingItems);
    }) 

    this.dataBaseManager.loadedEventsSubject.subscribe(loaded => {
      this.events = loaded;
      this.eventsSubject.next(this.events);
    })
    
    this.dataBaseManager.loadedUserSubject.subscribe(loaded => {
      this.user = loaded;
    })
  }


  createHouseMember(name: string) {
    this.houseMembers.push(new HouseMember(name, []));
    this.selectedHouseMember =this.houseMembers[this.houseMembers.length - 1];
    this.selectedHouseMemberSubject.next(this.selectedHouseMember);
    this.houseMembersSubject.next(this.houseMembers);
    return this.houseMembers.length - 1;
  }

  setFloorPlan(fp : FloorPlan) {
    this.floorPlan = fp;
    this.setRoomsFromFloorPlan(this.floorPlan);
    this.setChoresFromFloorPlan(this.floorPlan);
  }

  setChoresFromFloorPlan(fp : FloorPlan) {
    this.listOfChores = fp.getChores();
  }

  setRoomsFromFloorPlan(fp : FloorPlan) {
    this.rooms = fp.getRooms();
  }

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
    
  getHouseMembers() {
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
  
  onDone(chore: Chore) {
    
    chore.setDone();
    //chore.getAssignedTo().removeChore(chore);
    let houseMember = this.houseMembers[this.findHouseMemberByName(chore.getAssignedTo())];
    houseMember.removeChore(chore);
    this.houseMembersSubject.next(this.houseMembers);
    this.roomSubject.next(this.rooms);
  }

  clearChores() {

    for (let hm of this.houseMembers) {
      hm.clearChores();
    }

    for (let c of this.listOfChores) {
      c.reset();
    }
  }

  resetRoomStatues() {
    for (let r of this.rooms) {
      r.resetStatus();
    }
  }


  assignChores() {

    this.clearChores();
    this.resetRoomStatues();

    let numberOfChores = this.listOfChores.length;
    let numberOfHouseMembers = this.houseMembers.length;

    let maxInit = numberOfChores/numberOfHouseMembers|0;
    let max = maxInit - 1;
    let start = 0;

    for (let hm of this.houseMembers) {
      for (let i = start; i <= max; i++) {
        
        if (!this.listOfChores[i].isAssigned()) {
          hm.addChore(this.listOfChores[i]);
          this.listOfChores[i].assignToHouseMember(hm.getName());
        }

        if (i == max && max < numberOfChores - 1) {
          start = max + 1;
          max += maxInit;
          break;
        }

      }
    }

    let leftover = numberOfChores%numberOfHouseMembers;
    let incrementer = 0;

    if (leftover != 0) {
      for (let i = numberOfChores - leftover; i < numberOfChores - 1; i++) {
        this.houseMembers[incrementer].addChore(this.listOfChores[i]);
        this.listOfChores[i].assignToHouseMember(this.houseMembers[incrementer].getName());
        incrementer++;
      }
    }

    this.houseMembersSubject.next(this.houseMembers.slice());
    this.roomSubject.next(this.rooms.slice());
    
  }
  //services for chores list and floor plan component -- end


  // shopping list component methods -- start
  getShoppingItems() {
    return this.shoppingItems.slice();
  }

  addShoppingItem(item : ShoppingItemsObject) {
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
  //shopping list component methods-- end


  //services for calendar component -- start
  addEvent(event:EventObject) {

    this.events.push(event);
    this.eventsSubject.next(this.events);
  }


  getEvents() {
    return this.events.slice();
  }

  deleteEvent(event:EventObject){

    let eIdx = this.findEvent(event);

    this.events.splice(eIdx,1);

    this.eventsSubject.next(this.events);
  }

  findEvent(event:EventObject) {
    //return this.events.findIndex( (e:EventObject) => e.title === event.title && e.start === event.start && e.backgroundColor === event.backgroundColor)
    for (let i = 0; i < this.events.length; i++) {
      let e = this.events[i];

      let start = new Date(e.start)
      let str = start.toUTCString();
      let compTime = str == event.start;
      let compTitle = e.title === event.title
      let compColor = e.backgroundColor === event.backgroundColor

      if (compTitle &&  compColor && compTime) {
        return i;
      }
    }
  }

  clearEvents() {
    this.events = [];
    this.eventsSubject.next(this.events);
  }

  saveEvents() {
    this.dataBaseManager.saveEvents(this.events)
  }

  //services for calendar component -- end
}


