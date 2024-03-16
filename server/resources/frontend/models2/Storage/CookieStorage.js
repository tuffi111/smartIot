import {Storage} from './Storage'
import {Cookie} from "@/utils/cookie.js";
import {useApi} from "@/requests.js";


export class CookieStorage extends Storage {

    _cookieStore

    constructor(...args) {
        super(...args);
        this._cookieStore = new Cookie()
    }

    makeStore() {
        return {
            load: (name) => {
                return JSON.parse(this._cookieStore.load(this.storageKey(name)) ?? "{}") ?? {}
            },

            save(name, data) {
                this._cookieStore.save(this.storageKey(name), JSON.stringify(data))
                return this
            }
        }
    }


    maxAge(...args) {
        store.maxAge(...args)
        return this
    }

    expires(...args) {
        store.expires(...args)
        return this
    }

    path(...args) {
        store.path(...args)
        return this
    }
}


