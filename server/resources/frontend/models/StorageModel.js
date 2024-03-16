import {Model} from "@/models/Model.js";

export class StorageModel extends Model // SessionModel CookieModel
{
    //abstract store()
    _name = 'StorageModel'
    _route = 'models/'
    _apiHandler = []
    _initialFetch = true
    _autoUpdate = true
    _apiUpdate = true
    _resetApiUpdate = true
    _errorHandler = [];
    _endpoints = {
        'fetch': '',
        'update': ''
    }

    constructor(...args) {
        super(...args);
        this._initialFetch = this.initialFetch()
        this.bind(Model.EVENT_CHANGED, this.watch)
    }

    name() {
        return 'StorageModel'
    }

    storageKey() {
        return 'models_' + this.name()
    }

    initialFetch() {
        return this._initialFetch
    }

    update() {
        this.withApiUpdate(true)
        this.setStorageData(this.data())
    }

    fetch() {
        //this.withAutoUpdate(false)
        this.data(this.getStorageData())
    }

    setStorageData(data) {
        if (!this.withApiUpdate()) return false;
        this.store().setItem(this.storageKey(), JSON.stringify(data))
        return this
    }

    getStorageData() {
        return JSON.parse(this.store().getItem(this.storageKey()) ?? "{}") ?? {}
    }

    storage() {
        return {
            update: (data) => {
                if (this.withApiUpdate()) {
                    let oldData = this.getStorageData()
                    let newData = Object.assign(
                        {},
                        oldData,
                        {[this.name()]: data}
                    )

                    this.setStorageData(newData)
                }
                this.resetApiUpdate()
                return this
            },
            data: () => {
                return this.getStorageData()[this.name()]
            }
        }
    }

    makeData(set = {}) {
        if (this.withInitialFetch()) {
            set = Object.assign({}, set, this.storage().data() ?? {})
        }
        this.withApiUpdate(false)
        return super.makeData(set)
    }

    watch(data) {
        if (this.withAutoUpdate()) {
            this.storage().update(data)
        }
    }

    onErrors(handler) {
        this._errorHandler.push(handler)
    }

    raiseError(error) {

        for (const idx in this._errorHandler) {
            this._errorHandler[idx](error);
        }
    }

    withoutInitialFetch(set = true) {
        this.withInitialFetch(!set)
        return this
    }

    withInitialFetch(set = null) {
        if (set === null) {
            return this._initialFetch
        }
        this._initialFetch = !!set
        return this
    }


    resetApiUpdate(set = null) {
        if (set === null) {
            this.withApiUpdate(this._resetApiUpdate);
            return this._resetApiUpdate
        }
        this._resetApiUpdate = set
        return this
    }

    withApiUpdate(set = null) {
        if (set === null) {
            return this._apiUpdate
        }
        this._apiUpdate = !!set
        return this
    }

    withoutApiUpdate(set = true) {
        this.withAutoUpdate(!set)
        return this
    }

    store(set = null) {
        if (set === null) {
            return this._store
        }
        this._store = set
        return this
    }

    endpoints(set = null) {
        if (set === null) {
            return this._endpoints
        }
        this._endpoints = set
        return this
    }

    autoUpdate(set = null) {
        if (set === null) {
            return this._autoUpdate
        }
        this._autoUpdate = set
        return this
    }

    apiHandler(set = null) {
        if (set === null) {
            return this._apiHandler
        }
        this._apiHandler = set
        return this
    }

    route(path = '') {
        return this._route + path
    }
}
