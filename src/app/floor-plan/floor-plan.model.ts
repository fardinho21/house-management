import { Room } from "./room.model";
import { Chore } from "../shared/chore.model";
import { ManagerService } from 'src/app/shared/manager.service';
import { FloorPlanObject } from '../shared/interfaces';

export class FloorPlan {

    private _imagePath: string = "";

    private _testImagePath : string = "";

    private _rooms: Room[] = [];

    constructor (floorPlanObject?: FloorPlanObject) {

        this._imagePath = floorPlanObject.imagePath;

        this._rooms = floorPlanObject.rooms.map(room => {
            
            let chores = [];

            let r = new Room(
                room.name,
                room.roomGeo.xInit,
                room.roomGeo.yInit,
                room.roomGeo.width,
                room.roomGeo.height,
                room.finishedChores,
                []);

            for (let c of room.chores) {
                let chore = new Chore(c)
                chore.setParentRoom(r);
                chores.push(chore);
            }
            
            r.setChores(chores);

            return r;
        })


    }

    getImagePath () {
        return this._imagePath;
    }

    getRooms() {
        return this._rooms.slice();
    }
}