import { Room } from 'src/app/floor-plan/floor-plan/room.model';
import { Chore } from '../../shared/chore.model';

export class HouseMember {

    private choresList: Chore[] = [];
    private name: string = 'no-name';

    constructor(name:string, chores: Chore[]) {
        this.name = name;
        this.choresList = chores;
    }


    public getName(): string {
        return this.name
    }

    public setName(name: string){
        this.name = name;
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
}