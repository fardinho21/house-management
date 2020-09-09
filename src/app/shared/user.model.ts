export class User {

    constructor(
        public username: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date, 
        public registered?: boolean,
        public sharedHouseMem?: number) 
    { 
        let idx = username.indexOf('@');
        this.username = username.substring(0,idx);
    }

    

    get token() {
 
        if (!this._tokenExpirationDate  || new Date() > this._tokenExpirationDate) {
            return null;
        }

        return this._token;
    }

}