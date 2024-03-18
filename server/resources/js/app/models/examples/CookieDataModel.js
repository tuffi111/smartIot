import {Model} from "@/models/Model.js";
import {CookieStorage} from "@/models/Storage/CookieStorage.js";

export class CookieDataModel extends Model{

    name() {
        return "CookieData"
    }

    makeStorage() {
        return new CookieStorage()
    }

    model() {
        return {
            theme: 'COOKIE-theme',
            type: 1,
            address: {street: 'aaa', zip: 'aaa111', city: 'aaa111aaa'},
            tags: {'tag-1': 'tag-1', 'tag-11': 'tag-11', 'tag-111': 'tag-111'},
            rights: ['read', 'write'],
            time: '11:00:00'
        }
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
