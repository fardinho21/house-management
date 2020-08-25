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

    public setName(name: string){
        this.name = name;
    }

    public setChores(chores: Chore[]) {
        this.choresList = chores.slice();
    }

    public addChore(chore: Chore) {
        this.choresList.push(chore);
    }

    public removeChore(chore: Chore) {
        if (this.choresList.includes(chore)) {
            let idx = this.choresList.indexOf(chore);
            this.choresList.splice(idx,1);
        } else {
            console.log('This chore does not exist for ' + this.name + '!')
        }
    }

    public getChores(): Chore[] {
        return this.choresList.slice();
    }

    //resets and clears all the chores
    public clearChores() {
        for (let chore of this.choresList) {
            chore.reset();
        }
        this.choresList = [];
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