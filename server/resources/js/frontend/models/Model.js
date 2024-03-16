import {reactive, watch} from "vue";
import {Errors} from "@/errors.js";

export class Model {

    static EVENT_CHANGED = 'changed'
    _data
    _bindings = {};
    _autoUpdate = true
    _errors = new Errors(this);

    constructor(defaultData = {}) {
        this._autoUpdate = this.autoUpdate()
        this._defaultData = Object.assign({}, this.model(), defaultData)
    }

    name() {
        return 'Model'
    }

    model() {
        return {}
    }

    emptyModel(setTo = null) {
        let attributes = {}

        Object.objectDeepKeys(this.model()).forEach((key) => {
            attributes[key] = setTo
        })

        return attributes
    }

    autoUpdate() {
        return this._autoUpdate
    }


    makeData(set = {}) {
        return reactive(set)
    }

    data(keyChain = null) {
        if (this._data === undefined) {
            this._data = this.makeData(this._defaultData);

            watch(this._data, (newV, oldV) => {
                this.raise(Model.EVENT_CHANGED, newV, oldV)
            })

            this.raise(Model.EVENT_CHANGED, this._data)
        }

        if (keyChain) {
            return this._data[keyChain]
        }

        return this._data
    }

    has(keyChain) {
        return keyChain in this.data()
    }

    //get()
    //get( keyChain ) // wo/ default should throw an error if keyChain not exists
    //get( keyChain, default )
    get(keyChain = null, preset = undefined) {

        if (keyChain) {
            if (this.has(keyChain)) {
                return this.data()[keyChain]
            }

            if (preset instanceof Function) {
                preset = preset.call(this, keyChain)
            }

            return preset;
        }

        return this.data();
    }

    //set(data)
    //set(keyChain, value)
    set(dataOrKeyChain, value = undefined) {
        if (value === undefined) {
            Object.assign(this.data(), dataOrKeyChain)
            this.resetAutoUpdate()
            return this
        }
        this.data()[dataOrKeyChain] = value;
        this.resetAutoUpdate()
        return this
    }

    withAutoUpdate(set = null) {
        if (set === null) {
            return this._autoUpdate
        }
        this._autoUpdate = !!set
        return this
    }


    resetAutoUpdate(set = null) {
        if (set === null) {
            this.withAutoUpdate(this._resetAutoUpdate);
        }
        this._resetAutoUpdate = set
        return this
    }

    withoutAutoUpdate(set = true) {
        this.withAutoUpdate(!set)
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
}
