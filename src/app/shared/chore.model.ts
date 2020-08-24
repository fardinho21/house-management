import { HouseMember } from "../chore-list/chore-list/house-member.model";
import { Room } from '../floor-plan/floor-plan/room.model';

export class Chore {
    
    private parentRoom: Room;

    constructor(
        private choreName: string, 
        private done: boolean, 
        private assignedTo : HouseMember = null) {}

    getInfo() {


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
        this.assignedTo = null;
        this.parentRoom.choreCompleted(); //update room status
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