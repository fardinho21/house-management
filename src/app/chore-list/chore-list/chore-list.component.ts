import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HouseMember } from "./house-member.model";
import { ManagerService } from "../../shared/manager.service";
import { Chore } from 'src/app/shared/chore.model';

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

  addHouseMemberShowDialog : boolean = false;

  @ViewChild('addHouseMem', {static: false}) houseMemDialog : ElementRef<any>;

  houseMembers: HouseMember[] = [
    new HouseMember("Moje", []),
    new HouseMember("Wali", []),
    new HouseMember("Suf", [])
  ]

  selectedHouseMember: HouseMember;

  constructor(private manager: ManagerService) {
    this.manager.setHouseMembers(this.houseMembers);
  }

  ngOnInit(): void {
    if (this.houseMembers.length) {
      this.selectedHouseMember = this.houseMembers[0];
    }
  }

  ngAfterViewInit() {

  }

  onClickHouseMember(index: number) {
    this.selectedHouseMember = this.houseMembers[index];
  }

  onDone(chore: Chore) {
    chore.setDone();
  }

  onAddHouseMember() {
    this.addHouseMemberShowDialog = !this.addHouseMemberShowDialog;
  }


}
