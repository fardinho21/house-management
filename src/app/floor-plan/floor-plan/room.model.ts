export class Room {
    private _room : {
        name : string,
        xInit: number,
        yInit: number,
        width: number,
        height: number
    }

    constructor (name: string, xI: number, yI: number, w: number, h: number) {
        let r = {name: name, xInit: xI, yInit: yI, width: w, height: h};
        this._room = r;
    }
    
    getRoom() {
        return this._room;
    }
}