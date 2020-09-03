import { HouseMember } from "../chore-list/house-member.model";
import { Room } from '../floor-plan/room.model';
import { ChoresObject } from './interfaces';

export class Chore {
    
    private parentRoom: Room;
    private choreName: string;
    private done: boolean;
    private assignedTo: string = "";

    constructor(chore : ChoresObject){
        this.choreName = chore.choreName;
        this.done = chore.done;

    }

    getJSONObject() : ChoresObject {
        return {
            choreName: this.choreName, 
            done: this.done, 
            assignedTo: this.assignedTo, 
            parentRoom: this.parentRoom.getName()
        };
    }

    assignToHouseMember(memberName: string){
        this.assignedTo = memberName;
    }

    setDone() {
        this.done = true;
        this.parentRoom.choreCompleted(); //update room status
        this.parentRoom.updateRoomStatus();
    }

    reset(){
        this.done = false;
        this.assignedTo = "name";
    }

    isDone(){
        return this.done;
    }

    isAssigned() {
        return this.assignedTo === "name" ? false : true;
    }

    setParentRoom (room: Room) {
        this.parentRoom = room;
    }

    getAssignedTo () : string {
        return this.assignedTo;
    }
}