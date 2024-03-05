import {SessionModel} from "@app/models/SessionModel.js";

export class SessionDataModel extends SessionModel {

    name() {
        return "SessionData"
    }

    model(){
        return {
        theme: 'SessionModel-theme',
        type: 6,
        address: {street: 'fff', zip: 'fff666', city: 'fff666fff'},
        tags: {'tag-6': 'tag-6', 'tag-66': 'tag-66', 'tag-666': 'tag-666'},
        rights: ['read', 'write'],
        time: '16:00:00'
        }
    }

    validations() {
        return {
        //    email: [],
        //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
