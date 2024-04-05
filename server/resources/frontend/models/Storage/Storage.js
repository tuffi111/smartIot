import {ref} from "vue";

export class Storage {
    _storageKey = 'ModelStore'
    _store
    _model
    _data
    _name

    constructor(model=null) {
        if(model)this.model(model)
    }

    makeStore() {
        const store = {[this.storageKey()]: {}}
        return {
            find: (name, filter, order) => {
                return new Promise((resolve, reject) => {
                    resolve(store[this.storageKey()][name])
                })
            },

            save: (name, setData) => {
                return new Promise((resolve, reject) => {
                    store[this.storageKey()][name] = setData
                    resolve(store[this.storageKey()][name])
                })
            },

            delete: (name) => {
                return new Promise((resolve, reject) => {
                    resolve(delete store[this.storageKey()][name])
                })
            }
        }
    }

    find(name, filter = [], order = []) {
        return this.store().find(name, filter, order)
    }

    save(name, data) {
        return this.store().save(name, data)
    }

    delete(name) {
        return this.store().delete(name)
    }

    storageKey(name = null, concat = '/') {
        if (name) {
            return this._storageKey + concat + name
        }
        return this._storageKey
    }

    store() {
        if (!this._store) {
            this._store = this.makeStore()
        }

        return this._store
    }

    name(set = undefined) {
        if (set === undefined) {
            return this._name
        }
        this._name = set
        return this
    }

    model(set = undefined) {
        if (set === undefined) {
            return this._model
        }
        this._model = set
        return this
    }
}

