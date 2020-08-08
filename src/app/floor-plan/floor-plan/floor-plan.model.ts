import { Room } from "./room.model";
import { Chore } from "../../shared/chore.model";
import { ManagerService } from 'src/app/shared/manager.service';

export class FloorPlan {

    private _imagePath: string = "https://cdngeneral.rentcafe.com/dmslivecafe/3/626505/Valencia%20Combined.jpg?quality=85?quality=70&width=1024";

    private _rooms: Room[] = [
        new Room('livingRoom', 60, 30, 150, 150, 0, [
            new Chore("clean windows",false,null),
            new Chore("vaccum floor",false,null),
            new Chore("clean couches",false,null),
            new Chore("dust lamps",false,null),

        ]),
        new Room('dinningRoom', 60, 180, 150, 50, 0, [
            new Chore("mop floor",false,null),
        ]),
        new Room('kitchenArea', 60, 230, 100, 125, 0, [
            new Chore("clean sink",false,null),
            new Chore("clean counter top",false,null),
            new Chore("clean stove top",false,null),
            new Chore("clean fridge",false,null),
            new Chore("clean cabinets",false,null),
            new Chore("mop floor",false,null),         
        ]),
        new Room('firstFloorBathArea', 60, 355, 100, 60, 0, [
            new Chore("clean sink",false,null),
            new Chore("clean mirror",false,null),
            new Chore("clean toilet",false,null),
            new Chore("mop floor",false,null),
        ]),
        new Room('stairWell', 160, 230, 50, 90, 0, [
            new Chore("vaccum stairs",false,null)
        ]),
        new Room('laundryRoom', 160, 320, 50, 95, 0, [
            new Chore("mop floor",false,null) 
        ]),
        new Room('hallWayArea', 325, 175, 75, 140, 0, [
            new Chore("mop floor",false,null) 
        ]),
        new Room('upStairsBath', 290, 210, 35, 105, 0, [
            new Chore("clean sink",false,null),
            new Chore("clean toilet",false,null),
            new Chore("clean mirror",false,null),
            new Chore("clean shower",false,null),
            new Chore("mop floor",false,null),
        ]),
        new Room('masterBath', 245, 210, 45, 140, 0, [
            new Chore("clean sink",false,null),
            new Chore("clean toilet",false,null),
            new Chore("clean mirror",false,null),
            new Chore("clean shower",false,null),
            new Chore("mop floor",false,null)
        ])

    ];

    constructor (private manager: ManagerService) {
        this.manager.setRooms(this._rooms);
    }

    getImagePath () {
        return this._imagePath;
    }

    getRooms() {
        return this._rooms.slice();
    }
}