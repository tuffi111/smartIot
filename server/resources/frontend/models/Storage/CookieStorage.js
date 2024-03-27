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
                let data = this.cookieStore().load(this.storageKey(this.model().name()))
                if (data) {
                    try {
                        data = JSON.parse(data)
                    } catch (error) {
                        console.debug('Unsupported cookie data', error)
                        data = null
                    }
                }

                this.model().assignData(data??{})
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

    maxAge(setSeconds) {
        this.cookieStore().maxAge(setSeconds)
        return this
    }

    expires(setDate) {
        this.cookieStore().expires(setDate)
        return this
    }

    path(set) {
        this.cookieStore().path(set)
        return this
    }

    delete() {
        this.cookieStore().delete(this.storageKey(this.model().name()))
        return this
    }

    cookieStore(set = null) {
        if (set !== null) {
            this._cookieStore = set
            return this
        }

        if (!this._cookieStore) {
            this._cookieStore = this.makeCookieStore()
            // todo: implement cookie watcher/onChange handler
            // not working: document.cookies.onChanged.addListener((changeInfo) => {})
        }

        return this._cookieStore
    }
}


