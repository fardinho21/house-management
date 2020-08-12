import { Injectable } from '@angular/core';
import { Room } from '../floor-plan/floor-plan/room.model';
import { HouseMember } from '../chore-list/chore-list/house-member.model';
import { Chore } from "../shared/chore.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  rooms: Room[];
  houseMembersSubject = new Subject<HouseMember[]>();

  houseMembers : HouseMember[];

  constructor() { }

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

    this.clearChores();

    let numberOfChores = 0;
    let numberOfHouseMembers = this.houseMembers.length;
    let listOfChores : Chore[] = [];

    //copies the list of chores from each room
    for (let room of this.rooms) {
      let chores = room.getChores();
      Array.prototype.push.apply(listOfChores, chores);
    }

    numberOfChores = listOfChores.length;

    //asign chores

    /*
    evenly assign all the chores to each house member
    */
    let maxInit = numberOfChores/numberOfHouseMembers|0;
    let max = maxInit - 1;
    let start = 0;

    for (let hm of this.houseMembers) {

      for (let i = start; i <= max; i++) {

        if (!listOfChores[i].isAssigned()) {
          hm.addChore(listOfChores[i]);
          listOfChores[i].assignToHouseMember(hm);
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
        this.houseMembers[incrementer].addChore(listOfChores[i]);
        listOfChores[i].assignToHouseMember(this.houseMembers[incrementer]);
        incrementer++
      }
    }


    this.houseMembersSubject.next(this.houseMembers.slice());
  }
    

  private clearChores () {
    for (let member of this.houseMembers) {
      member.clearChores();
    }
  }

}


