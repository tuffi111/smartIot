import {Storage} from './Storage'

export class SessionStorage extends Storage {

    makeStore() {
        const store = window?.sessionStorage;
        return {
            find: async (name, filter, order) => {
                return new Promise((resolve) => {
                    resolve(JSON.parse(store.getItem(this.storageKey(name)) ?? "{}") ?? {})
                })
            },

            save: async (name, data) => {
                return new Promise((resolve) => {
                    store.setItem(this.storageKey(name), JSON.stringify(data))
                    resolve(data)
                })
            },

            delete: async (name) => {
                return new Promise((resolve, reject) => {
                    store.removeItem(this.storageKey(name))
                })
            }
        }
    }
}

