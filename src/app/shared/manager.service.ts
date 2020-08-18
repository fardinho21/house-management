import { Injectable } from '@angular/core';
import { Room } from '../floor-plan/floor-plan/room.model';
import { HouseMember } from '../chore-list/chore-list/house-member.model';
import { Chore } from "../shared/chore.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  rooms: Room[] = [
    new Room('livingRoom', 60, 30, 150, 150, [
        new Chore("clean windows",false,null),
        new Chore("vaccum floor",false,null),
        new Chore("clean couches",false,null),
        new Chore("dust lamps",false,null),

    ]),
    new Room('dinningRoom', 60, 180, 150, 50, [
        new Chore("mop floor",false,null),
    ]),
    new Room('kitchenArea', 60, 230, 100, 125, [
        new Chore("clean sink",false,null),
        new Chore("clean counter top",false,null),
        new Chore("clean stove top",false,null),
        new Chore("clean fridge",false,null),
        new Chore("clean cabinets",false,null),
        new Chore("mop floor",false,null),         
    ]),
    new Room('firstFloorBathArea', 60, 355, 100, 60, [
        new Chore("clean sink",false,null),
        new Chore("clean mirror",false,null),
        new Chore("clean toilet",false,null),
        new Chore("mop floor",false,null),
    ]),
    new Room('stairWell', 160, 230, 50, 90, [
        new Chore("vaccum stairs",false,null)
    ]),
    new Room('laundryRoom', 160, 320, 50, 95, [
        new Chore("mop floor",false,null) 
    ]),
    new Room('hallWayArea', 325, 175, 75, 140, [
        new Chore("mop floor",false,null) 
    ]),
    new Room('upStairsBath', 290, 210, 35, 105, [
        new Chore("clean sink",false,null),
        new Chore("clean toilet",false,null),
        new Chore("clean mirror",false,null),
        new Chore("clean shower",false,null),
        new Chore("mop floor",false,null),
    ]),
    new Room('masterBath', 245, 210, 45, 140, [
        new Chore("clean sink",false,null),
        new Chore("clean toilet",false,null),
        new Chore("clean mirror",false,null),
        new Chore("clean shower",false,null),
        new Chore("mop floor",false,null)
    ])

  ];

  roomSubject = new Subject<Room[]>();
  listOfChores : Chore[] = [];
  houseMembersSubject = new Subject<HouseMember[]>();

  houseMembers: HouseMember[] = [
    new HouseMember("Moje", []),
    new HouseMember("Wali", []),
    new HouseMember("Suf", [])
  ]

  selectedHouseMember: HouseMember = this.houseMembers[0];

  constructor() { 
    console.log(this.houseMembers);

    for (let room of this.rooms) {
      let chores = room.getChores();
      Array.prototype.push.apply(this.listOfChores, chores);
    }

    this.assignChores();
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

  /*
  copies the chores from each room and evenly assigns them
  */
  assignChores() {

    //unassign and reset all chores for each house member and 
    //set their chores list to an empty array
    
    this.clearChores();
    this.resetRoomStatuses();

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

        if (!this.listOfChores[i].isAssigned()) {
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
  }
    

  private clearChores () {
    for (let member of this.houseMembers) {
      member.clearChores();
    }
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
}


