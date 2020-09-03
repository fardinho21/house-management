import { Room } from "./room.model";
import { Chore } from "../shared/chore.model";
import { ManagerService } from 'src/app/shared/manager.service';
import { FloorPlanObject } from '../shared/interfaces';

export class FloorPlan {

    private _imagePath: string = "";
    private _testImagePath : string = "";
    private _rooms: Room[] = [];
    private _name : string;

    constructor (floorPlanObject?: FloorPlanObject) {

        this._imagePath = floorPlanObject.imagePath;
        this._name = floorPlanObject.name;
        this._rooms = floorPlanObject.rooms.map(room => {
            
            let chores = [];

            let r = new Room(
                room.name,
                room.roomGeo.xInit,
                room.roomGeo.yInit,
                room.roomGeo.width,
                room.roomGeo.height,
                room.roomGeo.status,
                room.finishedChores,
                []);

            for (let c of room.chores) {
                let chore = new Chore(c)
                chore.setParentRoom(r);
                chore.assignToHouseMember(c.assignedTo)
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

    getChores() {
        let chores : Chore[] = [];
        this._rooms.map( room => {
            chores = chores.concat(room.getChores());
        }) 
        return chores;
    }

    getJSONObject() : FloorPlanObject {

        let fpOb : FloorPlanObject = 
        {
            name: this._name,
            imagePath: this._imagePath,
            rooms: []
        }

        let rooms = this._rooms.map( room => {
            return room.getJSONObject();
        })

        fpOb.rooms = rooms;

        return fpOb;

    }
}