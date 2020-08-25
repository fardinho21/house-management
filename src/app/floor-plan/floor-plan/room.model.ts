import { Chore } from '../../shared/chore.model';
import { RoomObject } from 'src/app/shared/database-manager.service';


export class Room {

    private _name: string;
    private _finishedChores: number = 0;

    private _room : {
        xInit: number,
        yInit: number,
        width: number,
        height: number
        status: number
    }

    private _chores : Chore[];

    constructor (
        name: string, 
        xI: number, 
        yI: number, 
        w: number, 
        h: number,
        chores: Chore[]) {

        this._chores = chores;
        this._name = name;
        //set the parent room for each chore and set the status       

        for (let chore of chores) {
            if (chore.isDone()) {
                this._finishedChores++;
            }
        }

        let r = { xInit: xI, yInit: yI, width: w, height: h, status: 0 };

        r.status = this._finishedChores / this._chores.length

        this._room = r;


        for (let chore of this._chores) {
            chore.setParentRoom(this);
        }

    }
    
    getRoom() {
        return this._room;
    }

    getName() {
        return this._name;
    }

    isInside(x: number, y: number) : boolean { 

        let xBool : boolean =  x >= this._room.xInit && x < (this._room.xInit + this._room.width);
        let yBool : boolean = y >= this._room.yInit && y < (this._room.yInit + this._room.height);
        return xBool && yBool ? true : false;
        
    }

    getChores(){    
        return this._chores;
    }
    
    choreCompleted() {
        this._finishedChores++;
    }

    updateRoomStatus() {
        this._room.status = this._finishedChores/this._chores.length;
    }

    resetStatus() {
        this._finishedChores = 0;
        this._room.status = this._finishedChores/this._chores.length;
    }

    getJSONObject() : RoomObject {

        let chores : { 
            choreName: string;
            done: boolean; 
            assignedTo: string;
            parentRoom: string; }[] = [];

        for (let chore of this._chores){
            chores.push(chore.getInfo())
        }

        let jO : RoomObject = {
            name: this._name,
            finishedChores: this._finishedChores,
            room: this._room,
            chores: chores
        }

        return jO;
    }
}