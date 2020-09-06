import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, DoCheck, ChangeDetectorRef } from '@angular/core';
import { FloorPlan } from './floor-plan.model';
import { Room } from './room.model';
import { ManagerService } from '../shared/manager.service';
import { DatabaseManagerService } from "../shared/database-manager.service";
import { HouseMember } from '../chore-list/house-member.model';
import { timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit, AfterViewInit, AfterViewChecked {

  floorPlan: FloorPlan = null;
  imagePath : string = "";

  private fpCanvasRef : ElementRef<HTMLCanvasElement>;

  @ViewChild('fpCanvas', { static: false }) set fpCanvas(canvas: ElementRef) {

    if (canvas){
      console.log(canvas)
      this.fpCanvasRef = canvas;
    }
    
  };

  private _image = new Image();
  private _context: CanvasRenderingContext2D = null;
  private _canvas: HTMLCanvasElement;
  private _width = 450;
  private _height = 450;
  floorPlanChoresDialogShow :boolean=false;
  floorPlanChooseDialogShow :boolean=false;
  selectedFloorPlanIndex: string = "";
  selectedRoom : Room;
  membersWithUnfinishedChores : string[] = [];
  over = false;

  private _fillStyles: { [name: string]: string } =
  {
      'lightGreen': '#89eb34',
      'red': '#fc0303',
      'orange': '#fcca03'
  }

  constructor(
    private dataBaseManager: DatabaseManagerService, 
    private manager: ManagerService, 
    private changeDetectorRef : ChangeDetectorRef) {

  }

  ngAfterViewChecked() {
    if (this._canvas && this._context) {
      this.colorArea();
    }
  }

  ngOnInit(): void {
    this.selectedRoom = new Room("no-room",0,0,0,0,0,0,[]);

    this.manager.floorPlanSubject.subscribe(loaded => {
      this.floorPlan = loaded;
      this.changeDetectorRef.detectChanges();
      this._image.src = this.floorPlan ? this.floorPlan.getImagePath() : "" ;
      setTimeout(this.initCanvasAndContext.bind(this), 1000);
    })
  }


  ngAfterViewInit() {
    if (!this.floorPlan) {
      this.floorPlan = this.manager.floorPlan;
      this.changeDetectorRef.detectChanges();
      this._image.src = this.floorPlan ? this.floorPlan.getImagePath() : "" ;
      this.initCanvasAndContext();
    }
  }

  colorArea() {

    this.clearFloorPlan();

    for (let room of this.floorPlan.getRooms()) {

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

  onCanvasClick(mouseclick) {

    let rect = this._canvas.getBoundingClientRect();
    let xLoc = (mouseclick.clientX - rect.left)|0;
    let yLoc = (mouseclick.clientY - rect.top)|0;
    console.log(xLoc + " " + yLoc);
    let room: Room = this.checkClickInsideRoom(xLoc, yLoc);

    if (room !== null) {
      this.selectedRoom = room;
    }
    
  }

  private initCanvasAndContext() {

    if (!this.fpCanvasRef) {
      return
    }

    this._canvas = this.fpCanvasRef.nativeElement;
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._context = this.fpCanvasRef.nativeElement.getContext('2d');


    this._canvas.onmousemove = (movement) => {

      let rect = this._canvas.getBoundingClientRect();
      let xLoc = (movement.clientX - rect.left)|0;
      let yLoc = (movement.clientY - rect.top)|0;
      //console.log(xLoc + " " + yLoc);
      let roomName = this.checkHoverInsideRoom(xLoc, yLoc);
      if (roomName !==  null) {
        this.over = true;
      } else {
        this.over = false;
      }

    }

    this._context.drawImage(this._image, 0, 0, this._width, this._height);

    this.colorArea();

  }

  private checkClickInsideRoom(xMouse : number, yMouse: number) : Room{

    let rooms = this.floorPlan.getRooms();
    

    for (let room of rooms) {
      let check = room.isInside(xMouse, yMouse);
      if (check) {
        this.selectedRoom = room;
        this.onToggleChoresDialog();
        return room;
      }
    }
    return null;
  }

  private checkHoverInsideRoom (xMouse : number, yMouse: number) {
    let rooms = this.floorPlan.getRooms();

    for (let room of rooms) {
      let check = room.isInside(xMouse, yMouse);
      if (check) {
        return room;
      }
    }
    return null;
  }

  private clearFloorPlan() {
    this._context.clearRect(0, 0, this._width, this._height);

    this._context.globalAlpha = 1;
    this._context.drawImage(this._image, 0, 0, this._width, this._height);
    this._context.globalAlpha = 0.4;
  }

  onToggleChoresDialog () {
    console.log(this.selectedRoom);
    this.floorPlanChoresDialogShow = !this.floorPlanChoresDialogShow;
    
    let chores = this.selectedRoom.getChores();

    if(this.floorPlanChoresDialogShow) {
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

  onToggleChooseFloorPlanDialog() {
    this.floorPlanChooseDialogShow = !this.floorPlanChooseDialogShow;
  }

  chooseFloorPlan() {

    this.onToggleChooseFloorPlanDialog();
    this.dataBaseManager.fetchFloorPlan(this.selectedFloorPlanIndex)

  }

  selectedFloorPlan(selectedFpImage) {
    this.selectedFloorPlanIndex = selectedFpImage.explicitOriginalTarget.name;
    //this.onToggleChooseFloorPlanDialog()
  }


}
