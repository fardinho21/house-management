import { Chore } from '../../shared/chore.model';
import { HouseMemberObject, ChoresObject } from 'src/app/shared/database-manager.service';

export class HouseMember {

    private choresList: Chore[] = [];
    private name: string = 'no-name';

    constructor(name:string, chores: Chore[]) {
        this.name = name;
        chores.map(chore => {
           return chore.assignToHouseMember(this)
        })
        this.choresList = chores;
    }


    public getName(): string {
        return this.name
    }

    public findChore(roomName: string, choreName: string) : number {

        if (this.choresList.length == 0) {
            return -1;
        }

        for (let i = 0; i <= this.choresList.length - 1; i++) {
            let chore = this.choresList[i];
            let info = chore.getInfo();
            if (info.choreName == choreName && info.parentRoom == roomName ) {
                return i;
            }
        }

        return -1
    }

    public setChores(chores: Chore[]) {
        this.choresList = chores.slice();
    }

    public addChore(chore: Chore) {
        this.choresList.push(chore);
    }

    public removeChore(chore: Chore) {
        let info = chore.getInfo();
        let index = this.findChore(info.parentRoom, info.choreName);
        if (index >= 0){
            this.choresList.splice(index,1);
        }
    }

    public getChores(): Chore[] {
        return this.choresList.slice();
    }

    getJSONObject() : HouseMemberObject {

        let cList : ChoresObject[] = this.choresList.map(chore => {
            return chore.getInfo();
        })

        let jO : HouseMemberObject = {
            name: this.name,
            choresList: cList
        }
        
        return jO;
    }
}