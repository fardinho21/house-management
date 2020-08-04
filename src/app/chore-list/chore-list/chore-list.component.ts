import { Component, OnInit } from '@angular/core';
import { HouseMember } from "./house-member.model";

@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.css']
})
export class ChoreListComponent implements OnInit {


  houseMembers: HouseMember[] = [
    new HouseMember("Moje", ["clean kitchen", "clean bathroom"]),
    new HouseMember("Wali", ["mow lawn", "garbage"]),
    new HouseMember("Suf", ["clean living room", "walk dog"])
  ]

  selectedHouseMember: HouseMember;

  constructor() { }

  ngOnInit(): void {
    if (this.houseMembers.length) {
      this.selectedHouseMember = this.houseMembers[0];
    }
  }

  onClickHouseMember(index: number) {
    //console.log(index);
    this.selectedHouseMember = this.houseMembers[index];
  }

  onDone(index: number) {
    console.log(index);
  }



}
