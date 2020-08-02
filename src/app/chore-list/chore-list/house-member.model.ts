export class HouseMember {

    private choresList: string[] = []
    private name: string = 'no-name';


    public addChore(chore: string) {
        this.choresList.push(chore);
    }

    public removeChore(chore: string) {
        if (this.choresList.includes(chore)) {
            
        } else {
            console.log('This chore does not exist for ' + this.name + '!')
        }
    }

    public getChores() {
        return this.choresList.slice();
    }
}