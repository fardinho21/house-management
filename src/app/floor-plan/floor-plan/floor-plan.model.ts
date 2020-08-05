import { Room } from "./room.model";

export class FloorPlan {

    private _imagePath: string = "https://cdngeneral.rentcafe.com/dmslivecafe/3/626505/Valencia%20Combined.jpg?quality=85?quality=70&width=1024";

    private _rooms: Room[] = [
        new Room('livingRoom', 60, 30, 150, 150),
        new Room('dinningRoom', 60, 180, 150, 50),
        new Room('kitchenArea', 60, 230, 100, 125),
        new Room('firstFloorBathArea', 60, 355, 100, 60),
        new Room('stairWell', 160, 230, 50, 90),
        new Room('laundryRoom', 160, 320, 50, 95),
        new Room('hallWayArea', 325, 175, 75, 140),
        new Room('upStairsBath', 290, 210, 35, 105),
        new Room('masterBath', 245, 210, 45, 140)

    ];


    constructor () 
    {

    }

    getImagePath () {
        return this._imagePath;
    }

    getRooms() {
        return this._rooms.slice();
    }
}