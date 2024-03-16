import {Storage} from './Storage'

export class SessionStorage extends Storage {

    makeStore() {
        const store = window?.sessionStorage;
        return {
            load: (name) => {
                return JSON.parse(store.getItem(this.storageKey(name)) ?? "{}") ?? {}
            },

            save: (name, data) => {
                store.setItem(this.storageKey(name), JSON.stringify(data))
                return this
            }
        }
    }
}

