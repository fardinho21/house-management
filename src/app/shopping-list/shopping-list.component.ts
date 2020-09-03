import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HouseMember } from "../chore-list/house-member.model";
import { NgForm } from '@angular/forms';
import { ManagerService } from 'src/app/shared/manager.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  addItemDisplay : boolean = false;
  houseMembers : HouseMember[];
  shoppingItems: {name:string,amount:number,requestedBy:string}[] = []


  constructor(private manager : ManagerService) { 
    this.shoppingItems = manager.getShoppingItems();
    this.houseMembers = manager.getHouseMembers();

  }

  ngOnInit(): void {

    this.manager.shoppingItemsSubject.subscribe((shoppingItems) => {
      this.shoppingItems = shoppingItems;
    })

    this.manager.houseMembersSubject.subscribe((houseMembers: HouseMember[])=>{
      this.houseMembers = houseMembers;
    })
  }

  onToggleAddItemDialog() {
    this.addItemDisplay = !this.addItemDisplay;
  }

  onClearList() {
    this.manager.clearShoppingList();
  }

  onAddItem(form: NgForm) {
    this.onToggleAddItemDialog();
    //console.log(form.controls);

    let item = {
      name:form.controls["name"].value,
      amount: form.controls["amount"].value,
      requestedBy: form.controls["requestedby"].value
      }

      //console.log(form.controls["requestedby"].value);
      this.manager.addShoppingItem(item);
  }

  deleteItem(index : number){
    this.manager.deleteItem(index);
  } 

}
