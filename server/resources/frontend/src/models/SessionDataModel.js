import {SessionModel} from "@app/models/SessionModel.js";


export class SessionDataModel extends SessionModel {

    constructor(data = {}) {
        super(Object.assign({
            theme: 'theme-name-444',
            fontsize: 22,
            address: {street: '', zip: '', city: ''},
            tags: ['tag-4','tag-5','tag-6'],
            time: '11:00:00'
        }, data), name);

    }/**/

    name(){
        return "SessionData"
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
