export class Room {
    private _room : {
        name : string,
        xInit: number,
        yInit: number,
        width: number,
        height: number
    }

    constructor (
        name: string, 
        xI: number, 
        yI: number, 
        w: number, 
        h: number
        ) {
        let r = {name: name, xInit: xI, yInit: yI, width: w, height: h};
        this._room = r;
    }
    
    getRoom() {
        return this._room;

    }

    isInside(x: number, y: number) : boolean { 

        let xBool : boolean =  x >= this._room.xInit && x < (this._room.xInit + this._room.width);
        let yBool : boolean = y >= this._room.yInit && y < (this._room.yInit + this._room.height);
        return xBool && yBool ? true : false;
        
    }
}