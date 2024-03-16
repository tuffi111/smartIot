export class Storage {
    _storageKey = 'ModelStore'
    _name
    _data
    _storage

    constructor(name = undefined, data = {}) {
        if (name !== undefined) {
            this.name(name)
        }

        if (data !== undefined) {
            this.data(data)
        }
    }

    makeStore(name, data) {
        const store = {[this.storageKey()]: data}

        return {
            load: (name) => {
                return store[this.storageKey()][name]
            },
            save: (name, data) => {
                store[this.storageKey()][name] = data
                return this
            }
        }
    }

    get(name) {
        try {
            return this.store().load(name)
        } catch (error) {
            return {}
        }
    }

    set(name, data) {
        this.store().save(name, data)
    }


    storageKey(name = null, concat = '/') {
        if (name) {
            return this._storageKey + concat + name
        }
        return this._storageKey
    }

    store() {
        if (!this._storage) {
            this._storage = this.makeStore(this.name(), this.data())
        }

        return this._storage
    }

    name(set = undefined) {
        if (set === undefined) {
            return this._name
        }
        this._name = set
        return this
    }

    data(set = undefined) {
        if (set === undefined) {
            return this._data
        }
        this._data = set
        return this
    }
}

