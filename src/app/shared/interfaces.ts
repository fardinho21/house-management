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

export interface ShoppingItemsObject {
    itemName: string;
    amount: number;
    requestedBy: string;
}

export interface EventObject {
    title: string;
    start: string;
    backgroundColor: string;
}

export interface DataObject {
    floorPlan : FloorPlanObject;
    houseMembers : HouseMemberObject[];
    shoppingItems? : ShoppingItemsObject[];
    events? : EventObject[];
    id: string;
}


export interface UserObject{
    email: string;
    password: string;
    returnSecureToken: true;
  }
  
  export interface ResponseObject {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
  }