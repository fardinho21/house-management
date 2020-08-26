import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, DoCheck } from '@angular/core';
import { FloorPlan } from './floor-plan.model';
import { Room } from './room.model';
import { ManagerService } from 'src/app/shared/manager.service';
import { HouseMember } from 'src/app/chore-list/chore-list/house-member.model';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit, AfterViewInit, AfterViewChecked {

  /*
  This component is responsible for drawing the floor plan and updating the
  status (color) of each room.

  TODO: add a upload floor plan feature
  */

  private _floorPlan: FloorPlan;

  @ViewChild('fpCanvas', { static: false }) fpCanvas: ElementRef<HTMLCanvasElement>;

  private _image = new Image();
  private _context: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _width = 450;
  private _height = 450;
  floorPlanDialogShow :boolean=false;
  selectedRoom : Room;
  membersWithUnfinishedChores : HouseMember[] = [];
  over = false;


  private _fillStyles: { [name: string]: string } =
    {
      'lightGreen': '#89eb34',
      'red': '#fc0303',
      'orange': '#fcca03'
    }

  constructor(private manager: ManagerService) {
    this._floorPlan = new FloorPlan(this.manager);
  }

  ngAfterViewChecked() {
    this.colorArea();
  }

  ngOnInit(): void {
    this.selectedRoom = new Room("no-room",0,0,0,0,0,[]);
  }


  ngAfterViewInit() {

    this._canvas = this.fpCanvas.nativeElement;
    this._canvas.width = this._width;
    this._canvas.height = this._height;

    this._context = this.fpCanvas.nativeElement.getContext('2d');

    this._image.onload = () => {
      this._context.drawImage(this._image, 0, 0, this._width, this._height);
    }

    this._canvas.onmousemove = (movement) => {

      let rect = this._canvas.getBoundingClientRect();
      let xLoc = (movement.clientX - rect.left)|0;
      let yLoc = (movement.clientY - rect.top)|0;
      let roomName = this.checkHoverInsideRoom(xLoc, yLoc);
      //console.log(roomName);
      if (roomName !==  null) {
        this.over = true;
      } else {
        this.over = false;
      }

    }

    setTimeout(() => {
      this.colorArea();
    }, 500)

    this._image.src = this._floorPlan.getImagePath();
  }

  colorArea() {

    this.clearFloorPlan();

    for (let room of this._floorPlan.getRooms()) {

      let roomRef = room.getRoom();

      let rxI = roomRef.xInit;
      let ryI = roomRef.yInit;
      let wid = roomRef.width;
      let hit = roomRef.height;
      let status = roomRef.status;

      this._context.globalAlpha = 0.4;

      if (status == 1) {
        this._context.fillStyle = this._fillStyles.lightGreen;
      } else if (status < 1 && status >= 0.5) {
        this._context.fillStyle = this._fillStyles.orange;
      } else if (status < 0.5) {
        this._context.fillStyle = this._fillStyles.red;
      }
   
      this._context.beginPath();
      this._context.fillRect(rxI, ryI, wid, hit);
      this._context.rect(rxI, ryI, wid, hit);
      this._context.stroke();

    }
  }

  /*
  Mouse click event handler that checks if the click is inside
  a room. 

  TODO: Needs to indicate how many chores are left that
  room for each house member.
  */
  onCanvasClick(mouseclick) {

    let rect = this._canvas.getBoundingClientRect();
    let xLoc = (mouseclick.clientX - rect.left)|0;
    let yLoc = (mouseclick.clientY - rect.top)|0;
    let room: Room = this.checkClickInsideRoom(xLoc, yLoc);

    if (room !== null) {
      this.selectedRoom = room;
    }
    
  }

  /*
  Loops through each room to see if the mouse 
  click is inside.
  */
  private checkClickInsideRoom(xMouse : number, yMouse: number) : Room{

    let rooms = this._floorPlan.getRooms();
    

    for (let room of rooms) {
      let check = room.isInside(xMouse, yMouse);
      if (check) {
        this.selectedRoom = room;
        this.toggleDialog();
        return room;
      }
    }
    return null;
  }

  private checkHoverInsideRoom (xMouse : number, yMouse: number) {
    let rooms = this._floorPlan.getRooms();

    for (let room of rooms) {
      let check = room.isInside(xMouse, yMouse);
      if (check) {
        return room;
      }
    }
    return null;
  }

  /*
  Clears the floor plan of all rectangles
  */
  private clearFloorPlan() {
    this._context.clearRect(0, 0, this._width, this._height);

    this._context.globalAlpha = 1;
    this._context.drawImage(this._image, 0, 0, this._width, this._height);
    this._context.globalAlpha = 0.4;
  }

  toggleDialog () {
    console.log(this.selectedRoom);
    this.floorPlanDialogShow = !this.floorPlanDialogShow;
    
    let chores = this.selectedRoom.getChores();

    if(this.floorPlanDialogShow) {
      for (let chore of chores) {
        if (!chore.isDone()) {
          let member = chore.getAssignedTo();
          if (this.membersWithUnfinishedChores.indexOf(member) == -1) {
            this.membersWithUnfinishedChores.push(member);
          }
        }
      }
    } else {
      this.membersWithUnfinishedChores = [];
    }

  }

}
