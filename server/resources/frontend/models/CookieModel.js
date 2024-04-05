import {Model} from "@/models/Model.js";
import {CookieStorage} from "@/models/Storage/CookieStorage.js";


export class CookieModel extends Model {

    makeStorage() {
        return new CookieStorage()
    }

    maxAge(setSeconds) {
        this.storage().maxAge(setSeconds)
        return this
    }

    expires(setDate) {
        this.storage().expires(setDate)
        return this
    }

    path(set) {
        this.storage().path(set)
        return this
    }
}

