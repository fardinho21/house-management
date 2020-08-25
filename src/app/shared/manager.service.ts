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

  shoppingItems: {name: string, amount:number, requestedBy: string}[] = [
    {name:"Bread",amount:3,requestedBy: 'dummy'},
    {name:"Apple",amount:5,requestedBy: 'dummy'},
    {name:"Paper Towel",amount:1,requestedBy: 'dummy'},
  ]
  listOfChores : Chore[] = [];
  events: {title:string,start:string}[] = [
    {title:"event1",start:"2020-08-04"},
    {title:"event2",start:"2020-08-03"}
  ];
  selectedHouseMember: HouseMember = new HouseMember("",[]);


  //subjects
  roomSubject = new Subject<Room[]>();
  houseMembersSubject = new Subject<HouseMember[]>();
  shoppingItemsSubject = new Subject<{name:string,amount:number,requestedBy:string}[]>();
  selectedHouseMemberSubject = new Subject<HouseMember>();

  eventsSubject = new Subject<{title:string,start:string}[]>();

  constructor(private dataBaseManager : DatabaseManagerService) { 

    console.log(this.houseMembers);
    console.log(this.rooms);

    //dataBaseManager.fetchChores();

    dataBaseManager.loadedChoresSubject.subscribe(loaded => {
      let runningList = []
      for (let key in loaded){
        let chore  = new Chore(loaded[key].choreName,loaded[key].done, null)
        runningList.push(chore);
      }
      this.listOfChores = runningList.slice();
      console.log(this.listOfChores);
    })

    dataBaseManager.loadedRoomsSubject.subscribe(loaded => {
      let runningList = []
      for (let key in loaded){

        //create a new room for each found in the database
        let roomObject = loaded[key];
        let roomGeo = roomObject.room;

        let choreList = roomObject.chores.map((chore) => {
          return new Chore(chore.choreName, chore.done)
        });


        runningList.push(
          new Room(
            roomObject.name,
            roomGeo.xInit,
            roomGeo.yInit,
            roomGeo.width,
            roomGeo.height,
            choreList
            )
        )
      }
      this.rooms = runningList.slice();

      for (let room of this.rooms) {
        this.listOfChores = this.listOfChores.concat(room.getChores());
      }

      console.log(this.rooms);
    })

    dataBaseManager.loadedHouseMembersSubject.subscribe(loaded => {
      let runningList = []

      for (const key in loaded) {
        let houseMemberObject = loaded[key];
        let hm = new HouseMember(houseMemberObject.name,[]);
        let choresList = loaded[key].choresList ? loaded[key].choresList.map(chore => {
          return new Chore(chore.choreName, chore.done, hm);
        }) : [];

        hm.setChores(choresList);
        runningList.push(hm);
      }
      this.houseMembers = runningList.slice();
      this.houseMembersSubject.next(this.houseMembers.slice())
      this.selectedHouseMemberSubject.next(this.houseMembers[0]);
      console.log(this.houseMembers);
    })

  }

  //services for chores list and floor plan component -- start
  private clearChores () {
    for (let member of this.houseMembers) {
      member.clearChores();
    }
  }

  setRooms(rooms: Room[]){
    this.rooms = rooms;
  }

  setHouseMembers(houseMembers: HouseMember[]) {
    this.houseMembers = houseMembers;
  }

  createHouseMember(name: string) {
    if (name != "") {

      let newHouseMember = new HouseMember(name, []);

      let found = this.houseMembers.find((element) => {
        return (element.getName() == newHouseMember.getName());
      })

      if (typeof (found) == "undefined") {
        this.houseMembers.push(newHouseMember);
        this.houseMembersSubject.next(this.houseMembers.slice());
      } else {
        alert("House member " + newHouseMember.getName() + " is already on the list!");
      }

    }

  }

  getChores () {
    return this.listOfChores.slice();
  }
    /*
    copies the chores from each room and evenly assigns them
    */
  assignChores() {

    //unassign and reset all chores for each house member and 
    //set their chores list to an empty array
    
    //this.clearChores();
    //this.resetRoomStatuses();

    let numberOfChores = this.listOfChores.length;
    let numberOfHouseMembers = this.houseMembers.length;

    /*
    evenly assign all the chores to each house member. 
    */
    let maxInit = numberOfChores/numberOfHouseMembers|0;
    let max = maxInit - 1;
    let start = 0;

    for (let hm of this.houseMembers) {

      for (let i = start; i <= max; i++) {

        if (!this.listOfChores[i].isAssigned() && !this.listOfChores[i].isDone()) {
          hm.addChore(this.listOfChores[i]);
          this.listOfChores[i].assignToHouseMember(hm);
        }

        if (i == max && max < numberOfChores - 1) {
          start = max + 1;
          max += maxInit;
          break;
        }
  
      }

    }

    let leftover = numberOfChores % numberOfHouseMembers;
    let incrementer = 0;

    if (leftover != 0) {
      for (let i = numberOfChores - leftover; i <= numberOfChores - 1; i ++) {
        this.houseMembers[incrementer].addChore(this.listOfChores[i]);
        this.listOfChores[i].assignToHouseMember(this.houseMembers[incrementer]);
        incrementer++
      }
    }



    this.houseMembersSubject.next(this.houseMembers.slice());
    this.roomSubject.next(this.rooms.slice());
    this.selectedHouseMember = this.houseMembers[0];
    this.selectedHouseMemberSubject.next(this.selectedHouseMember);
  }

    
  getHouseMemebers() {
    return this.houseMembers.slice();
  }

  getRooms() {
    return this.rooms.slice();
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

    for (let hm of this.houseMembers) {
      if (hm.getChores().indexOf(chore) != -1) {
        hm.removeChore(chore);
        break;
      }
    }
    console.log(this.houseMembers);
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


