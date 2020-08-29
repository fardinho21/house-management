import { HouseMember } from "../chore-list/house-member.model";
import { Room } from '../floor-plan/room.model';
import { ChoresObject } from './interfaces';

export class Chore {
    
    private parentRoom: Room;
    private choreName: string;
    private done: boolean;
    private assignedTo: HouseMember = null;

    constructor(chore : ChoresObject){
        this.choreName = chore.choreName;
        this.done = chore.done;
    }

    getInfo() : ChoresObject {
        return {
            choreName: this.choreName, 
            done: this.done, 
            assignedTo: this.assignedTo ? this.assignedTo.getName() : "", 
            parentRoom: this.parentRoom.getName()
        };
    }

    assignToHouseMember(member: HouseMember){
        this.assignedTo = member;
    }

    setDone() {
        this.done = true;
        this.parentRoom.choreCompleted(); //update room status
        this.parentRoom.updateRoomStatus();
    }

    reset(){
        this.done = false;
        this.assignedTo = null;
    }

    isDone(){
        return this.done;
    }

    isAssigned() {
        return this.assignedTo != null ? true : false;
    }

    setParentRoom (room: Room) {
        this.parentRoom = room;
    }

    getAssignedTo () : HouseMember{
        return this.assignedTo;
    }
}