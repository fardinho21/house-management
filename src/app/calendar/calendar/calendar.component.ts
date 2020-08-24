import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent, Calendar, CalendarApi } from "@fullcalendar/angular";
import { NgForm } from '@angular/forms';
import { ManagerService } from 'src/app/shared/manager.service';
import { EventInput, EventSourceInput } from "@fullcalendar/core";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.onClickDate.bind(this),
    events: [
      {
        
      }
    ]
  }

  @ViewChild('calendar', { static: false }) calendar: FullCalendarComponent;
  calendarApi: CalendarApi;
  addEventDialogShow: boolean = false;

  clickedDate: Date = new Date();

  constructor(private manager: ManagerService) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      dateClick: this.onClickDate.bind(this),
      eventClick: this.onClickEvent.bind(this),
      events: this.manager.getEvents()
      
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.calendarApi = this.calendar.getApi();

    this.manager.eventsSubject.subscribe((eventsList) => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        dateClick: this.onClickDate.bind(this),
        eventClick: this.onClickEvent.bind(this),
        events: eventsList
      };
    });

  }

  onToggleAddEventDialog() {
    this.addEventDialogShow = !this.addEventDialogShow;
  }

  onClickDate(event) {
    this.clickedDate = event.date;
    console.log(this.clickedDate.toLocaleDateString());
    this.onToggleAddEventDialog();
  }

  onAddEvent(form: NgForm) {


    let eventName: string = form.controls["name"].value;
    let eventColor = form.controls["color"].value;
    let date = this.clickedDate.toLocaleDateString().split('/');
    let copy = date.slice();
    let parsedDate = this.parseDate(copy);
    let event = {
      title: eventName,
      start: parsedDate,
      backgroundColor: eventColor
    };


    this.manager.addEvent(event);


    this.onToggleAddEventDialog();
    
  }

  onClickEvent(event) {
    console.log(event.event);
  }

  private parseDate(date: string[]): string {

    let copy = date.slice();

    if (copy[0].length < 2) {
      copy[0] = "0" + copy[0];
    }

    if (copy[1].length < 2) {
      copy[1] = "0" + copy[1];
    }

    date[0] = copy[2];
    date[1] = copy[0];
    date[2] = copy[1];

    return date.join('-');

  }
}
