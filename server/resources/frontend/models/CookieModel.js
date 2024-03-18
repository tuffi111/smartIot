import {Model} from "@/models/Model.js";
import {CookieStorage} from "@/models/Storage/CookieStorage.js";


export class CookieModel extends Model {

    makeStorage() {
        return new CookieStorage()
    }

    clear(...args){
        this.storage().delete(...args)
    }

    maxAge(...args) {
        this.storage().maxAge(...args)
        return this
    }

    expires(...args) {
        this.storage().expires(...args)
        return this
    }

    path(...args) {
        this.storage().path(...args)
        return this
    }
}

