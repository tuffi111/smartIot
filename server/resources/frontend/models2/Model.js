import {reactive, watch} from "vue";
import {Storage} from "./Storage/Storage";


export class Model {
    static EVENT_CHANGED = 'changed'

    _data
    _storage
    _modelData = {}
    _changed = false
    _autoLoad = true
    _autoSave = true
    _bindings = {};

    constructor(modelData = undefined) {
        if (modelData !== undefined) {
            this._modelData = modelData
        }
    }

    name(set = null) {
        return 'Model'
    }

    model() {
        return {}
    }

    makeData() {
        return reactive(Object.assign({}, this._modelData, this.model()))
    }

    assignData(data) {
        Object.assign(this.data(), data)
    }

    makeStorage() {
        return new Storage()
    }

    has(key) {
        return key in this.data()
    }

    get(key = null, dflt = undefined) {
        if (key) {
            if (!this.has(key) && dflt !== undefined) {
                if (dflt instanceof Function) {
                    dflt = dflt()
                }
                return dflt
            }
            return this.data()[key]
        }

        return this.data()
    }

    set(keyOrData, value = undefined) {
        if (value === undefined) {
            this.assignData(keyOrData)
        } else {
            this.data()[keyOrData] = value
        }

        this.changed(true)

        if (this.autoSave()) {
            this.save()
        }

        return this
    }


    load() {
        this.assignData(this.storage().get(this.name()))
        this.changed(false)
        return this
    }

    save(force = false) {
        if (force || this.changed()) {
            this.storage().set(this.name(), this.data())
        }
        this.changed(false)
        return this
    }


    autoLoad(set = null) {
        if (set === null) {
            return this._autoLoad
        }
        this._autoLoad = set
        return this
    }

    autoSave(set = null) {
        if (set === null) {
            return this._autoSave
        }
        this._autoSave = set
        return this
    }

    changed(set = null) {
        if (set === null) {
            return this._changed
        }
        this._changed = set
        return this
    }

    onChange(newValue, oldValue) {
        this.raise(Model.EVENT_CHANGED, newValue, oldValue)
        if (this.autoSave()) {
            this.storage().set(this.name(), newValue)
        }
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

    data(set = null) {
        if (set) {
            this._data = set
            return this
        }

        if (!this._data) {
            this._data = this.makeData()
            if (this.autoLoad()) {
                this.load()
            }

            watch(this._data, (newValue, oldValue) => {
                this.onChange(newValue, oldValue)
            })
        }

        return this._data
    }


    storage(set = null) {
        if (set) {
            this._storage = set
            this._storage.name(this.name())
            this._storage.data(Object.assign({}, this.model(), this.data()))
            return this
        }

        if (!this._storage) {
            this.storage(this.makeStorage())
        }

        return this._storage
    }
}

