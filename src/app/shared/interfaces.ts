export interface HouseMemberObject {
    name: string;
    choresList: ChoresObject[];
}
  
export interface RoomGeometry {
    xInit: number;
    yInit: number;
    width: number;
    height: number;
    status: number;
}

export interface RoomObject {
    name: string;
    finishedChores: number;
    roomGeo: RoomGeometry;
    chores: ChoresObject[]
}

export interface ChoresObject {
    choreName: string;
    done: boolean; 
    assignedTo: string;
    parentRoom: string;
}

export interface FloorPlanObject {
    name: string;
    imagePath: string;
    rooms: RoomObject[];
}