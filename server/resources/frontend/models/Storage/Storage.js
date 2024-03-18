import {ref} from "vue";

export class Storage {
    static EVENT_CHANGED = 'changed'

    _storageKey = 'ModelStore'
    _store
    _data
    _name
    _bindings = {};
    _loading = ref(false)

    constructor(model = null) {
        if (model) {
            this.model(model)
        }
    }

    makeStore() {
        const store = {[this.storageKey()]: {}}

        return {
            load: () => {
                return store[this.storageKey()][this.model().name()]
            },
            save: (setData) => {
                store[this.storageKey()][this.model().name()] = setData
                this.raise(Storage.EVENT_CHANGED, setData)
                return setData
            }
        }
    }

    get() {
        try {
            return this.store().load()
        } catch (error) {
            return {}
        }
    }

    set(data) {
        this.store().save(data)
        return this
    }

    raise(event, data, oldData) {
        for (let handlerId in this._bindings[event]) {
            this._bindings[event][handlerId].call(this, data, oldData)
        }
    }

    bind(event, handler) {
        if (!this._bindings[event]) {
            this._bindings[event] = []
        }
        this._bindings[event].push(handler);
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


    loading(set = null) {
        if (set === null) {
            return this._loading.value
        }

        this._loading.value = !!set
        this.model().loading(set)
        return this
    }
}

