import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HouseMember } from "./house-member.model";
import { ManagerService } from "../shared/manager.service";
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

  addHouseMemberShowDialog: boolean = false;

  houseMembers : HouseMember[] = [];  
  selectedHouseMember: HouseMember = new HouseMember("",[]);

  constructor(private manager: ManagerService, private dataBaseManager : DatabaseManagerService) {
    //dataBaseManager.fetchRooms();
  }

  //subscribes to the managers hoseMembersSubject
  ngOnInit(): void {
    if (this.houseMembers.length) {
      this.selectedHouseMember = this.houseMembers[0];
    }

    this.manager.houseMembersSubject.subscribe((newHouseMembers: HouseMember[]) => {
      this.houseMembers = newHouseMembers;
    });

    this.manager.selectedHouseMemberSubject.subscribe(selected => {
      this.selectedHouseMember = selected;
      this.manager.selectedHouseMemberSubject.unsubscribe();
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


  onCreateHouseMember(form: NgForm) {

    let name = form.controls['name'].value;
    this.manager.createHouseMember(name);
    this.toggleHouseMemberDialog();

  }

  //database methods start 

  onSaveRoomsToDataBase(){
    let rooms = this.manager.getRooms().map((room) => {
      return room.getJSONObject();
    });
    this.dataBaseManager.saveRooms(rooms);
  }

  onFetchRoomsFromDataBase() {
    this.dataBaseManager.fetchRooms();
  }

  onSaveHouseMembersToDataBase() {
    let hm = this.manager.getHouseMemebers().map((houseMem) => {
      return houseMem.getJSONObject();
    });
    this.dataBaseManager.saveHouseMembers(hm);
  }

  onFetchHouseMembersFromDataBase(){
    this.dataBaseManager.fetchHouseMembers();
  }

  //database methods end
}
