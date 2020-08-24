import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HouseMember } from "./house-member.model";
import { ManagerService } from "../../shared/manager.service";
import { Chore } from 'src/app/shared/chore.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatabaseManagerService } from 'src/app/shared/database-manager.service';


@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.css']
})
export class ChoreListComponent implements OnInit, AfterViewInit {

  /*
  This component is responsible for displaying the chores of 
  the selected house member.
  */

  addHouseMemberShowDialog: boolean = false;

  houseMembers : HouseMember[];  
  selectedHouseMember: HouseMember;

  constructor(private manager: ManagerService, private dataBaseManager : DatabaseManagerService) {
    this.houseMembers = this.manager.getHouseMemebers();
    this.selectedHouseMember = this.manager.getSelected();
  }

  //subscribes to the managers hoseMembersSubject
  ngOnInit(): void {
    if (this.houseMembers.length) {
      this.selectedHouseMember = this.houseMembers[0];
    }

    this.manager.houseMembersSubject.subscribe((newHouseMembers: HouseMember[]) => {
      this.houseMembers = newHouseMembers;
      console.log(this.houseMembers);
    });
  }

  ngAfterViewInit() {
  }

  onClickHouseMember(index: number) {
    this.selectedHouseMember = this.houseMembers[index];
  }

  onDone(chore: Chore) {
    
    this.manager.onDone(chore);
    
  }

  toggleHouseMemberDialog() {
    this.addHouseMemberShowDialog = !this.addHouseMemberShowDialog;
  }

  /*
    adds new house member if they arent on the list
  */
  onCreateHouseMember(form: NgForm) {

    let name = form.controls['name'].value;
    this.manager.createHouseMember(name);
    this.toggleHouseMemberDialog();

  }

  onAssignChores() {

    this.manager.assignChores();

  }


  //database methods
  onSaveChoresToDataBase() {
    let chores  = this.manager.getChores().map((chore) => {
      return chore.getInfo();
    });
    this.dataBaseManager.saveChores(chores);
  }

  onFetchChoresFromDataBase() {
    this.dataBaseManager.fetchChores();
  }

  onSaveRoomsToDataBase(){
    let rooms = this.manager.getRooms().map((room) => {
      return room.getJSONObject();
    });
    this.dataBaseManager.saveRooms(rooms);
  }

  onFetchRoomsFromDataBase() {
    
  }

}
