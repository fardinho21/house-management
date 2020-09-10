export class User {

    private _houseMemberIndex = null;

    constructor(
        public username: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date, 
        public registered?: boolean) 
    { 
        let idx = username.indexOf('@');
        this.username = username.substring(0,idx);
    }

    set houseMemberIndex(hMidx : number){
        this._houseMemberIndex = hMidx;
    }

    get houseMemberIndex() {
        return this._houseMemberIndex;
    }

    get token() {
 
        // if (!this._tokenExpirationDate  || new Date() > this._tokenExpirationDate) {
        //     return null;
        // }

        return this._token;
    }

}