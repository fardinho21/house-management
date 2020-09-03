import { Chore } from '../shared/chore.model';
import { RoomObject, ChoresObject, RoomGeometry } from '../shared/interfaces';


export class Room {

    private _name: string;
    private _finishedChores: number = 0;

    private _room : RoomGeometry;

    private _chores : Chore[];

    constructor (
        name: string, 
        xI: number, 
        yI: number, 
        w: number, 
        h: number,
        s: number,
        finChores: number,
        chores: Chore[]) {
        this._chores = chores;
        this._name = name;
        this._finishedChores = finChores;

        let r = { xInit: xI, yInit: yI, width: w, height: h, status: s };

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
        return this._chores.slice();
    }

    setChores(chores: Chore[]) {
        this._chores = chores;
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

        let chores : ChoresObject[] = [];

        for (let chore of this._chores){
            chores.push(chore.getJSONObject());
        }

        let jO : RoomObject = {
            name: this._name,
            finishedChores: this._finishedChores,
            roomGeo: this._room,
            chores: chores
        }

        return jO;
    }
}