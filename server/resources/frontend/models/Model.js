import {reactive, ref, watch} from "vue";
import {Storage} from "@/models/Storage/Storage";
import {Errors} from "@/errors";
import {isObject, isArray} from "@/utils";

export class Model {
    static EVENT_CHANGED = 'updated';

    _data = undefined
    _storage = undefined
    _defaultData = {}
    _collection = ref([])
    _filter = ref([])
    _order = ref({})
    _changed = false
    _autoLoad = true
    _autoSave = true
    _bindings = {};
    _errors = new Errors(this);
    _loading = ref(false)
    _doNotChange = false

    constructor(set = {}) {
        this._defaultData = set
    }

    model() {
        return {}
    }

    name() {
        return 'Model'
    }

    [Symbol.iterator]() {
        let index = -1;
        let collection = this._collection;
        return {
            next: () => ({value: collection[++index], done: !(index in collection)})
        };
    };

    makeStorage() {
        return new Storage(this)
    }

    makeData() {
        return reactive(Object.assign({},
            this.model(),
            this._defaultData
        ))
    }

    assignData(data) {
        if (isObject(data)) {
            Object.assign(this.data(), data)
            this._collection.value = [data]
            return this
        }

        if (isArray(data) && data.length === 1) {
            Object.assign(this.data(), data[0])
        }

        this._collection.value = data
    }

    filter(set = null) {
        if (set) {
            if (isArray(set)) {
                this._filter.value.concat(set)
            } else {
                this._filter.value.push(set)
            }
            return this
        }

        return this._filter
    }

    order(set = null) {
        if (set) {
            Object.assign(this._order, set)
            return this
        }

        return this._order
    }


    data(set = null) {
        if (set) {
            this._data.value = set
            return this
        }

        if (!this._data) {
            this._data = this.makeData()

            watch(this._data, (newValue, oldValue) => {
                this.onChange(newValue, oldValue)
            })

            if (this.autoLoad()) {
                (async () => await this.find())()
            }
        }

        return this._data
    }

    find() {
        this.loading(true)
        return this.storage().find(this.name(), this.filter(), this.order())
            .then((data) => {
                this.assignData(data)
                return data
            })
            .finally(() => {
                this.loading(false)
            })
    }

    async wait() {
        return await this.find()
    }

    save(data = undefined) {
        if (data === undefined) {
            data = this.data()
        }

        this.loading(true)
        return this.storage().save(this.name(), data)
            .then((data) => {
                this.assignData(data)
                return data
            })
            .finally(() => {
                this.loading(false)
            })
    }


    delete() {
        this.loading(true)
        return this.storage().delete(this.name())
            .then(() => {
                this._doNotChange=true
                Object.assign(
                    this._data,
                    {},
                    this.model(),
                    this._defaultData
                )/**/

            })
            .finally(() => {
                this._doNotChange=false
                this.loading(false)
            })
    }

    all() {
        return this.find()
    }

    first() {
        return this.data()[0]
    }

    get(key = null) {
        if (key) {
            return this.data()[key]
        }
        return this.data()
    }

    set(keyOrSet, set = undefined) {
        if (set === undefined) {
            Object.assign(this.data(), keyOrSet)
        } else {
            this.data()[keyOrSet] = set
        }
        return this
    }


    storage(set = null) {
        if (set) {
            this._storage = set
            return this
        }

        if (!this._storage) {
            const storage = this.makeStorage()
            if (!storage) {
                throw new Error('Missing storage for model: ' + this.name())
            }
            this.storage(storage)
        }

        return this._storage
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
        if(this._doNotChange)return
        this.changed(true)
        this.raise(Model.EVENT_CHANGED, newValue, oldValue)
        if (this.autoSave()) {
            this.save(newValue)
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
