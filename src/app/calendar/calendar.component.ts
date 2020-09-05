import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent, Calendar, CalendarApi } from "@fullcalendar/angular";
import { NgForm } from '@angular/forms';
import { ManagerService } from '../shared/manager.service';
import { EventInput, EventSourceInput, EventInstance } from "@fullcalendar/core";
import { EventObject } from "../shared/interfaces";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.onClickDate.bind(this),
    eventClick: this.onClickEvent.bind(this),
    eventMouseEnter: this.onMouseOver.bind(this),
    eventMouseLeave: this.onMouseOver.bind(this),
    events: [
      {
        
      }
    ]
  }

  @ViewChild('calendar', { static: false }) calendar: FullCalendarComponent;
  calendarApi: CalendarApi;
  addEventDialogShow: boolean = false;
  eventInfoDialogShow : boolean = false;
  overDate : boolean = false;
  selectedEvent : EventObject = {title: "", start: ""};

  clickedDate: Date = new Date();

  constructor(private manager: ManagerService) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      dateClick: this.onClickDate.bind(this),
      eventClick: this.onClickEvent.bind(this),
      eventMouseEnter: this.onMouseOver.bind(this),
      eventMouseLeave: this.onMouseLeave.bind(this),
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
        eventMouseEnter: this.onMouseOver.bind(this),
        eventMouseLeave: this.onMouseOver.bind(this),
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
    let time = form.controls['time'].value;
    
    let date = this.clickedDate.toLocaleDateString().split('/');
    let copy = date.slice();
    let parsedDate = new Date(this.parseDate(copy) + " " + time);
    console.log(parsedDate);
    let event = {
      title: eventName,
      start: parsedDate,
      backgroundColor: eventColor
    };


    this.manager.addEvent(event);


    this.onToggleAddEventDialog();
    
  }

  onMouseOver(overData) {
    this.overDate = !this.overDate
    console.log(overData);
  }

  onMouseLeave(leaveData) {
    this.overDate = !this.overDate
    console.log(leaveData)
  }

  onToggleEventInfoDialog() {
    this.eventInfoDialogShow = !this.eventInfoDialogShow;
  }

  onClickEvent(event) {

    this.onToggleEventInfoDialog();



    this.selectedEvent = 
    {
      title: event.event.title,
      start: event.event._instance.range.start
    }


    console.log(event);
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
