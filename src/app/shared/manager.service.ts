import { Injectable } from '@angular/core';
import { Room } from '../floor-plan/floor-plan/room.model';
import { HouseMember } from '../chore-list/chore-list/house-member.model';
import { Chore } from "../shared/chore.model";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  rooms: Room[];
  houseMembers: HouseMember[];

  constructor() { }

  setRooms(rooms: Room[]){
    this.rooms = rooms;
  }

  setHouseMembers(houseMembers: HouseMember[]) {
    this.houseMembers = houseMembers;
  }

  assignChores() {
    
    let numberOfChores = 0;
    let numberOfHouseMembers = this.houseMembers.length;

    let listOfChores : Chore[] = [];

    for (let room of this.rooms) {
      let chores = room.getChores();
      Array.prototype.push.apply(listOfChores, chores);
    }

    numberOfChores = listOfChores.length;

    //asign chores

    /*
    if there is an even amount of chores between all
    members, evenly assign them all
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

    
  }
    

}


