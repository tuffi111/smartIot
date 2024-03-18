import {Storage} from './Storage'

export class SessionStorage extends Storage {

    makeStore() {
        const store = window?.sessionStorage;
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

