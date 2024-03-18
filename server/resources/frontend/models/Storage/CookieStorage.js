import {Storage} from './Storage'
import {Cookie} from "@/utils/cookie.js";


export class CookieStorage extends Storage {

    _cookieStore

    makeCookieStore() {
        return new Cookie()
    }

    makeStore() {
        return {
            load: () => {
                this.model().assignData(
                    JSON.parse(this.cookieStore().load(
                        this.storageKey(this.model().name())
                    ) ?? "{}") ?? {}
                )
            },

            save: (data) => {
                this.cookieStore().save(
                    this.storageKey(this.model().name()),
                    JSON.stringify(data)
                )
                return this
            }
        }
    }

    maxAge(...args) {
        this.cookieStore().maxAge(...args)
        return this
    }

    expires(...args) {
        this.cookieStore().expires(...args)
        return this
    }

    path(...args) {
        this.cookieStore().path(...args)
        return this
    }

    delete(...args) {
        this.cookieStore().delete(...args)
        return this
    }

    cookieStore(set = null) {
        if (set !== null) {
            this._cookieStore = set
            return this
        }

        if (!this._cookieStore) {
            this._cookieStore = this.makeCookieStore()
        }

        return this._cookieStore
    }
}


