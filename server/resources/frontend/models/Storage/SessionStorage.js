import {Storage} from './Storage'

export class SessionStorage extends Storage {

    makeStore() {
        const store = window?.sessionStorage;
        return {
            load: () => {
                this.model().assignData(
                    JSON.parse(store.getItem(this.storageKey(this.model().name())) ?? "{}") ?? {}
                )
                return this
            },

            save: (data) => {
                store.setItem(this.storageKey(this.model().name()), JSON.stringify(data))
                this.model().assignData(data)
                return this
            }
        }
    }
}

