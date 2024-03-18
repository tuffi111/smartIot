import {Storage} from './Storage'

export class LocalStorage extends Storage {

    makeStore() {
        const store = window?.localStorage;
        return {
            load: () => {
                return JSON.parse(store.getItem(this.storageKey(this.model().name)) ?? "{}") ?? {}
            },

            save: (data) => {
                store.setItem(this.storageKey(this.model().name), JSON.stringify(data))
                return this
            }
        }
    }
}

