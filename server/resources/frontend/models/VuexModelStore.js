import {createStore as vuexCreateStore} from 'vuex'


//let modelStore = {}
let modelStore

export function createStore(options = {}, store = null) {
    store = store ?? vuexCreateStore(options)
    //modelStore[store] = VuexModelStore.registerTo(store)
    modelStore = new VuexModelStore(store)
    return store
}

export function useModelStore() {
    return modelStore
}


export class VuexModelStore {

    static EVENT_UPDATE = 'update:modelValue'
    _store

    constructor(store = null) {
        if (store) this.store(store)
    }


    stateName() {
        return 'ModelStore'
    }

    state(model = null) {
        if (model) {
            return this.store().state[this.stateName()][model.name()]
        } else {
            return this.store().state[this.stateName()]
        }
    }

    commit(model, data, oldData) {
        return this.store().commit(this.stateName() + '/' + VuexModelStore.EVENT_UPDATE, [model, data, oldData]) // see also: makeStoreModule().mutations
    }

    makeStoreModule(data) {
        return {
            namespaced: true,
            state: () => data,
            mutations: {
                [VuexModelStore.EVENT_UPDATE](state, data) {
                    let model = data[0]
                    //let oldData = data[2]
                    state[model.name()] = data[1];  // new data
                }
            },
        }
    }

    store(set = undefined) {
        if (set === undefined) {
            return this._store
        }

        set.registerModule(
            [this.stateName()],
            this.makeStoreModule({})
        )

        this._store = set
        return this
    }

}

