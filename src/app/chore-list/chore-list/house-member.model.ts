export class HouseMember {

    private choresList: string[] = []
    private name: string = 'no-name';

    constructor(name:string, chores: string[]) {
        this.name = name;
        this.choresList = chores;
    }


    public getName(): string {
        return this.name
    }

    public setName(name: string){
        this.name = name;
    }

    public addChore(chore: string) {
        this.choresList.push(chore);
    }

    public removeChore(chore: string) {
        if (this.choresList.includes(chore)) {
            let idx = this.choresList.indexOf(chore);
            this.choresList.splice(idx,1);
        } else {
            console.log('This chore does not exist for ' + this.name + '!')
        }
    }

    public getChores(): string[] {
        return this.choresList.slice();
    }
}