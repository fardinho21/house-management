import { HouseMember } from "../chore-list/chore-list/house-member.model";
import { Room } from '../floor-plan/floor-plan/room.model';

export class Chore {
    
    private parentRoom: Room;

    constructor(private choreName: string, private done: boolean, private assignedTo : HouseMember = null) {

    }

    getInfo() {
        return {choreName: this.choreName, done: this.done, assignedTo: this.assignedTo, parentRoom: this.parentRoom};
    }

    assignToHouseMember(member: HouseMember){
        this.assignedTo = member;
    }

    setDone() {
        this.done = true;
        this.parentRoom.choreCompleted();
        this.assignedTo.removeChore(this);
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
}