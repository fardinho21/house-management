import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HouseMember } from "./house-member.model";
import { ManagerService } from "../../shared/manager.service";

@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.css']
})
export class ChoreListComponent implements OnInit, AfterViewInit {


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
    setTimeout(() => {
      console.log(this.houseMembers);
    }, 4000) 
  }

  onClickHouseMember(index: number) {
    this.selectedHouseMember = this.houseMembers[index];
  }

  onDone(index: number) {
    console.log(index);
  }



}
