import { HouseMember } from 'src/app/chore-list/chore-list/house-member.model';
import { Chore } from 'src/app/shared/chore.model';

export class Room {

    private _name: string;

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
        s: number,
        chores: Chore[],) {

        let r = {xInit: xI, yInit: yI, width: w, height: h, status: s};
        this._room = r;
        this._chores = chores;
        this._name = name;

        for (let chore of this._chores) {
            chore.setParentRoom(this._name);
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

    getChores() {
        return this._chores;
    }
}