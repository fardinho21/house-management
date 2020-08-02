import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.css']
})
export class ChoreListComponent implements OnInit {


  houseMembers: string[] = [
    "HouseMember 1",
    "HouseMember 2",
    "HouseMember 3"
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onClickHouseMember(index: number) {
    console.log(index);
  }

}
