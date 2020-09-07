import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
    eventRemove: this.deleteEvent.bind(this),
    events: [
      {
        
      }
    ]
  }


  @ViewChild('calendar', { static: false }) calendar: FullCalendarComponent;
  calendarApi: CalendarApi;
  addEventDialogShow: boolean = false;
  eventInfoDialogShow : boolean = false;
  clearEventsConfirmDialogShow : boolean = false;
  overDate : boolean = false;
  selectedEvent : EventObject = {title: "", start: "", backgroundColor: ""};
  selectedEventId : string = "";
  numberOfEvents : number = 0;

  clickedDate: Date = new Date();

  constructor(private manager: ManagerService, private changeDetectorRef: ChangeDetectorRef) { 

    this.manager.eventsSubject.subscribe((eventsList) => {

      this.numberOfEvents = eventsList.length;
      let newlist = eventsList.map( e => {

        let date = new Date(e.start); date.setHours(date.getHours() + 4);

        return {
          title: e.title,
          start: date,
          backgroundColor: e.backgroundColor
        }
      })

      this.calendarOptions = {
        initialView: 'dayGridMonth',
        dateClick: this.onClickDate.bind(this),
        eventClick: this.onClickEvent.bind(this),
        eventMouseEnter: this.onMouseOver.bind(this),
        eventMouseLeave: this.onMouseOver.bind(this),
        events: newlist
      };
    });



  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.calendarApi = this.calendar.getApi();
    this.numberOfEvents = this.manager.getEvents().length;
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      dateClick: this.onClickDate.bind(this),
      eventClick: this.onClickEvent.bind(this),
      eventMouseEnter: this.onMouseOver.bind(this),
      eventMouseLeave: this.onMouseLeave.bind(this),
      events: this.manager.getEvents().map(e => {
        let date = new Date(e.start); date.setHours(date.getHours() + 4);

        return {
          title: e.title,
          start: date,
          backgroundColor: e.backgroundColor
        }
      })
    }

    this.calendarApi.refetchEvents()
    
    this.changeDetectorRef.detectChanges();
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
    let time = form.controls['time'].value + ":00";
    let timeSplit = time.split(':')
    this.clickedDate.setHours(+timeSplit[0],+timeSplit[1],+timeSplit[2]);
    let parsedDate = new Date(this.clickedDate)
    
    parsedDate.setHours((parsedDate.getHours() - 4))



    let event = {
      title: eventName,
      start: parsedDate.toUTCString(),
      backgroundColor: eventColor
    };


    this.manager.addEvent(event);


    this.onToggleAddEventDialog();
    
  }

  onMouseOver(overData) {
    this.overDate = !this.overDate
    
  }

  onMouseLeave(leaveData) {
    this.overDate = !this.overDate
    
  }

  onToggleEventInfoDialog() {
    this.eventInfoDialogShow = !this.eventInfoDialogShow;
  }

  onToggleClearEventsDialog() {
    this.clearEventsConfirmDialogShow = !this.clearEventsConfirmDialogShow;
  }

  clearEvents(){
    this.manager.clearEvents();
    this.onToggleClearEventsDialog();
  }

  onClickEvent(event) {

    this.onToggleEventInfoDialog();

    let dateString = new Date(event.event._instance.range.start);
    let dateStr = dateString.toUTCString();

    this.selectedEvent = 
    {
      title: event.event.title,
      start: dateStr,
      backgroundColor: event.event._def.ui.backgroundColor
    }

  }

  deleteEvent() {
    this.manager.deleteEvent(this.selectedEvent);
    this.eventInfoDialogShow = !this.eventInfoDialogShow;
  }

  saveEvents() {
    this.manager.saveEvents();
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
