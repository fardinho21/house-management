import { Room } from "./room.model";
import { Chore } from "../shared/chore.model";
import { ManagerService } from 'src/app/shared/manager.service';

export class FloorPlan {

    private _imagePath: string = "https://cdngeneral.rentcafe.com/dmslivecafe/3/626505/Valencia%20Combined.jpg?quality=85?quality=70&width=1024";

    private _rooms: Room[] = [];

    constructor (private manager: ManagerService) {

        this._rooms = manager.getRooms();
        this.manager.roomSubject.subscribe((rooms : Room[]) => {
            this._rooms = rooms;
        })
    }

    getImagePath () {
        return this._imagePath;
    }

    getRooms() {
        return this._rooms.slice();
    }
}