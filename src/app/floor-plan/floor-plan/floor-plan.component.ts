import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit, AfterViewInit {

  private imagePath: string = "https://cdngeneral.rentcafe.com/dmslivecafe/3/626505/Valencia%20Combined.jpg?quality=85?quality=70&width=1024";

  @ViewChild('fpCanvas', {static: false}) fpCanvas : ElementRef<HTMLCanvasElement>;

  private image = new Image();
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private width = 450;
  private height = 450;

  private fillStyles: {[name: string]:string} = 
  {
    'lightGreen' : '#89eb34',
    'red' : '#fc0303',
    'orange': '#fcca03'
  }

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    this.canvas = this.fpCanvas.nativeElement;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context = this.fpCanvas.nativeElement.getContext('2d');

    this.image.onload = () => {
      this.context.drawImage(this.image, 0, 0, this.width, this.height);
    }
    this.image.src = this.imagePath;

    setTimeout(() => {
      this.colorArea()
    }, 3000);
  }

  colorArea() {
    this.context.globalAlpha = 0.5;
    this.context.fillStyle = this.fillStyles.orange;
    this.context.beginPath();
    this.context.fillRect(20,20,150,100);
    this.context.stroke();
  }

}
