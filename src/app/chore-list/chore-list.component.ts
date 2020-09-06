import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { HouseMember } from "./house-member.model";
import { ManagerService } from "../shared/manager.service";
import { Chore } from 'src/app/shared/chore.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatabaseManagerService } from 'src/app/shared/database-manager.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.css']
})
export class ChoreListComponent implements OnInit, AfterViewInit {

  addHouseMemberShowDialog: boolean = false;

  houseMembers : HouseMember[] = [];
  selectedHouseMember: HouseMember = new HouseMember("",[]);

  constructor(
    private manager: ManagerService, 
    private dataBaseManager : DatabaseManagerService, 
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) {

      console.log(this.activatedRoute.url);
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
    });
  }

  ngAfterViewInit() {
    if (this.houseMembers.length == 0 && this.selectedHouseMember.getName() == "") {
      this.houseMembers = this.manager.houseMembers;
      this.selectedHouseMember = this.houseMembers[0] ? this.houseMembers[0] : this.selectedHouseMember ; 
      this.changeDetectorRef.detectChanges();
    }

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

  onAssignChores() {
    this.manager.assignChores();
  }


  onCreateHouseMember(form: NgForm) {

    let name = form.controls['name'].value;
    this.manager.createHouseMember(name);
    this.toggleHouseMemberDialog();

  }

  //database methods start 

  onSaveData() {
    let fp = this.manager.floorPlan.getJSONObject();
    let hmList = this.manager.getHouseMembers().map(hm => {
      return hm.getJSONObject();
    });

    this.dataBaseManager.saveUserData(fp, hmList);
  }


  //database methods end
}
