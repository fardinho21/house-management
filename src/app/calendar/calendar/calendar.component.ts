import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from "@fullcalendar/angular";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  }

  addEventDialogShow: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleAddEventDialog() {
    this.addEventDialogShow = !this.addEventDialogShow;
  }

  onAddEvent(form: NgForm){

    console.log(form);
    this.onToggleAddEventDialog();
  }

}
