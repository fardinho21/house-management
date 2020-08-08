import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FloorPlan } from './floor-plan.model';
import { Room } from './room.model';
import { ManagerService } from 'src/app/shared/manager.service';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit, AfterViewInit {

  private _floorPlan: FloorPlan;

  @ViewChild('fpCanvas', { static: false }) fpCanvas: ElementRef<HTMLCanvasElement>;

  private _image = new Image();
  private _context: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _width = 450;
  private _height = 450;
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

  ngOnInit(): void {

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
      let roomName = this.checkClickInsideRoom(xLoc, yLoc);
      console.log(roomName);
      if (roomName != 'no-room') {
        this.over = true;
      } else {
        this.over = false;
      }

    }

    this._image.src = this._floorPlan.getImagePath();

    setTimeout(() => {
      this.colorArea();
    },1000);

    this.manager.assignChores();

  }

  colorArea() {

    for (let room of this._floorPlan.getRooms()) {

      let roomRef = room.getRoom();

      let rxI = roomRef.xInit;
      let ryI = roomRef.yInit;
      let wid = roomRef.width;
      let hit = roomRef.height;
      let status = roomRef.status;

      this._context.globalAlpha = 0.4;

      if (status == 100) {
        this._context.fillStyle = this._fillStyles.lightGreen;
      } else if (status < 70) {
        this._context.fillStyle = this._fillStyles.orange;
      } else if (status < 50) {
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
    let roomName = this.checkClickInsideRoom(xLoc, yLoc);
    
  }

  private checkClickInsideRoom(xMouse : number, yMouse: number) : string{

    let rooms = this._floorPlan.getRooms();

    for (let room of rooms) {
      let check = room.isInside(xMouse, yMouse);
      if (check) {
        return room.getName();
      }
    }
    return "no-room";
  }

}
