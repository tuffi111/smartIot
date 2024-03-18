import {reactive, ref, watch} from "vue";
import {Storage} from "./Storage/Storage";
import {Errors} from "@/errors.js";

export class Model {
    static EVENT_CHANGED = 'changed'

    _data
    _storage
    _modelData = {}
    _changed = false
    _autoLoad = true
    _autoSave = true
    _bindings = {};
    _errors = new Errors(this);
    _loading = ref(false)

    constructor(modelData = undefined) {
        if (modelData !== undefined) {
            this._modelData = modelData
        }
    }

    name() {
        return 'Model'
    }

    model() {
        return {}
    }

    makeData() {
        return reactive(Object.assign({},
            this.model(),
            this._modelData
        ))
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
        this.changed(true)
        if (value === undefined) {
            this.assignData(keyOrData)
        } else {
            this.assignData({[keyOrData]: value})
        }

        return this
    }


    load() {
        this.storage().get()
        this.changed(false)
        return this
    }

    save(force = false) {
        if (force || this.changed()) {
            this.storage().set(this.data())
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
        this.changed(true)
        this.raise(Model.EVENT_CHANGED, newValue, oldValue)
        if (this.autoSave()) {
            this.storage().set(newValue, oldValue)
        }
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
            this._storage.model(this)
            return this
        }

        if (!this._storage) {
            this.storage(this.makeStorage())
            this.storage().model(this)
            this.storage().bind(Storage.EVENT_CHANGED, () => {

            })
        }

        return this._storage
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

    validate() {

    }

    validations(set = null) {
        if (set) {
            this._validations = set
            return this
        }
        return this._validations
    }

    validation(key) {
        if (key in this.validations()) {
            return this.validations()[key]
        }
        console.warn(`No validations set for key "${key}" in Model "${this.name()}"`)
        return []
    }

    errors(set = null) {
        if (set) {
            this._errors = set
            return this
        }
        return this._errors
    }

    loading(set = null) {
        if (set === null) {
            return this._loading.value
        }

        this._loading.value = !!set
        return this
    }
}
