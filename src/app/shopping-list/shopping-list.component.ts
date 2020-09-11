import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HouseMember } from "../chore-list/house-member.model";
import { NgForm } from '@angular/forms';
import { ManagerService } from 'src/app/shared/manager.service';
import { DatabaseManagerService } from '../shared/database-manager.service';
import { ShoppingItemsObject } from '../shared/interfaces';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  addItemDisplay : boolean = false;
  confirmClearListDisplay : boolean = false;
  houseMembers : HouseMember[];
  shoppingItems: ShoppingItemsObject[] = []


  constructor(public manager : ManagerService, private dataBaseManager : DatabaseManagerService) { 
      // this.shoppingItems = manager.getShoppingItems();
      this.houseMembers = manager.getHouseMembers();
      this.dataBaseManager.fetchShoppingItems();
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

  onToggleClearListDialog() {
    this.confirmClearListDisplay = !this.confirmClearListDisplay;
  }

  onClearList() {
    this.manager.clearShoppingList();
    if (this.confirmClearListDisplay) {
      this.confirmClearListDisplay = false;
    }
  }

  onAddItem(form: NgForm) {
    this.onToggleAddItemDialog();
    //console.log(form.controls);

    let item = {
      itemName:form.controls["name"].value,
      amount: form.controls["amount"].value,
      requestedBy: form.controls["requestedby"].value
      }

      //console.log(form.controls["requestedby"].value);
      this.manager.addShoppingItem(item);
  }

  deleteItem(index : number){
    this.manager.deleteItem(index);
  } 

  onSaveShoppingItems() {
    this.dataBaseManager.saveShoppingItems(this.shoppingItems);
  }



}
