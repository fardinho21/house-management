import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FloorPlan } from './floor-plan.model';
import { Room } from './room.model';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit, AfterViewInit {

  private _floorPlan: FloorPlan;

  @ViewChild('fpCanvas', {static: false}) fpCanvas : ElementRef<HTMLCanvasElement>;

  private _image = new Image();
  private _context: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _width = 450;
  private _height = 450;

  private _fillStyles: {[name: string]:string} = 
  {
    'lightGreen' : '#89eb34',
    'red' : '#fc0303',
    'orange': '#fcca03'
  }

  constructor() {
    this._floorPlan = new FloorPlan();
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

    this._image.src = this._floorPlan.getImagePath();

    setTimeout(() => {
      this.colorArea()
    }, 3000);
  }

  colorArea() {

    for (let room of this._floorPlan.getRooms()) {

      let rxI = room.getRoom().xInit;
      let ryI = room.getRoom().yInit;
      let wid = room.getRoom().width;
      let hit = room.getRoom().height;

      this._context.globalAlpha = 0.4;
      this._context.fillStyle = this._fillStyles.lightGreen;
  
      this._context.beginPath();
      this._context.fillRect(rxI,ryI,wid,hit);
      this._context.rect(rxI, ryI, wid, hit);
      this._context.stroke();
      
    }
  }

}
