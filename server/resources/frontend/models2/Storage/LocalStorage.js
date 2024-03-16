import {Storage} from './Storage'

export class LocalStorage extends Storage {

    makeStore() {
        const store = window?.localStorage;
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

