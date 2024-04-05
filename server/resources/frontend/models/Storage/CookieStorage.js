import {Storage} from './Storage'
import {Cookie} from "@/utils/cookie.js";


export class CookieStorage extends Storage {

    _cookieStore

    makeCookieStore() {
        return new Cookie()
    }

    makeStore() {
        return {
            find: (name, filter, order) => {
                return new Promise((resolve) => {
                    let data = this.cookieStore().load(this.storageKey(name))
                    if (data) {
                        try {
                            data = JSON.parse(data)
                        } catch (error) {
                            console.error('Unsupported cookie data', error)
                            data = null
                        }
                    }
                    resolve(data ?? {})
                })
            },

            save: (name, data) => {
                return new Promise((resolve) => {
                    this.cookieStore().save(this.storageKey(name), JSON.stringify(data))
                    resolve(data)
                })
            },

            delete: (name) => {
                return new Promise((resolve) => {
                    resolve(this.cookieStore().delete(this.storageKey(name)))
                })
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


