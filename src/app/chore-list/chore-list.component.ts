import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { HouseMember } from "./house-member.model";
import { ManagerService } from "../shared/manager.service";
import { Chore } from 'src/app/shared/chore.model';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { DatabaseManagerService } from 'src/app/shared/database-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.css']
})
export class ChoreListComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedHouseMemberSubscription : Subscription;
  houseMembersSubscription : Subscription;
  loadedUserSubscription : Subscription;

  addHouseMemberShowDialog: boolean = false;
  shareLinkShowDialog: boolean = false;
  baseLink : string = "http://localhost:4200/";
  shareLink : string = this.baseLink;
  houseMembers : HouseMember[] = [];
  selectedHouseMember: HouseMember = new HouseMember("",[]);
  myIndex : number = -1;
  selectedIndex : number = -1;

  constructor(
    public manager: ManagerService, 
    private dataBaseManager : DatabaseManagerService, 
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute : ActivatedRoute,
    private clipboard : Clipboard) {

      this.baseLink = "http://localhost:4200/" + this.activatedRoute.snapshot.url.toString().split(',').join('/');
      
  }

  //subscribes to the managers hoseMembersSubject
  ngOnInit(): void {


    if (this.houseMembers.length) {
      this.selectedHouseMember = this.houseMembers[0];
    }

    this.selectedHouseMemberSubscription = this.manager.houseMembersSubject.subscribe((newHouseMembers: HouseMember[]) => {
      this.houseMembers = newHouseMembers;
    });

    this.houseMembersSubscription = this.manager.selectedHouseMemberSubject.subscribe(selected => {
      this.selectedHouseMember = selected;
      this.shareLink = this.baseLink + "/0";
    });

    this.loadedUserSubscription = this.dataBaseManager.loadedUserSubject.subscribe(loaded => {

      if (loaded){
        this.myIndex = loaded.houseMemberIndex;
      }
        

    })

  }

  ngOnDestroy() {
    this.loadedUserSubscription.unsubscribe();
    this.houseMembersSubscription.unsubscribe();
    this.selectedHouseMemberSubscription.unsubscribe();

    this.selectedHouseMember = new HouseMember("",[]);
    this.myIndex = -1;
    this.selectedIndex = -1;
    this.houseMembers = [];
    
  }

  ngAfterViewInit() {
    if (this.houseMembers.length == 0 && this.selectedHouseMember.getName() == "") {
      this.houseMembers = this.manager.houseMembers;
      this.selectedHouseMember = this.houseMembers[0] ? this.houseMembers[0] : this.selectedHouseMember ; 
      this.changeDetectorRef.detectChanges();
    }
    
  }

  onClickHouseMember(index: number) {
    this.selectedIndex = index;
    this.selectedHouseMember = this.houseMembers[index];
    this.shareLink = this.baseLink + "/" + index;
  }

  copyToClipboard(){
    this.clipboard.copy(this.shareLink)
    alert("copied link!")
  }

  onDone(chore: Chore) {
    
    this.manager.onDone(chore);
    
  }

  toggleHouseMemberDialog() {
    this.addHouseMemberShowDialog = !this.addHouseMemberShowDialog;
  }

  toggleShareLinkDialog() {
    this.shareLinkShowDialog = !this.shareLinkShowDialog;
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
