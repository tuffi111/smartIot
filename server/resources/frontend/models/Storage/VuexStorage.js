import {Storage} from './Storage'
import {useStore} from "vuex";

export class VuexStorage extends Storage {
    static EVENT_UPDATE = 'update:modelValue'
    static EVENT_DELETE = 'delete:modelValue'

    _vuexStore

    constructor(model) {
        super(model);
    }

    makeStore() {
        return {
            find: async (name, filter, order) => {
                return new Promise((resolve, reject) => {
                    resolve(
                        this.vuexStore(name).state[this.storageKey()][name]
                    )
                })
            },

            save: async (name, data, oldData) => {
                return new Promise((resolve, reject) => {
                    this.vuexStore(name).commit(this.storageKey(name) + '/' + VuexStorage.EVENT_UPDATE, {
                        model: name,
                        data,
                        oldData,
                    }) // see also: this.makeStoreModule().mutations
                }) // see also: this.makeStoreModule().mutations
            },

            delete: async (name) => {
                return new Promise((resolve, reject) => {
                    this.vuexStore(name).dispatch(this.storageKey(name) + '/' + VuexStorage.EVENT_DELETE, name)
                })
            }
        }
    }

    makeVuexStore(name) {
        const _store = useStore()

        if (!_store.hasModule(this.storageKey())) {
            _store.registerModule(this.storageKey(), this.makeStoreModule({}))
        }

        if (!_store.hasModule([this.storageKey(), name])) {
            _store.registerModule([this.storageKey(), name], this.makeStoreModule(this.model().data()))
        }

        return _store
    }

    makeStoreModule(data) {
        return {
            namespaced: true,

            state: () => data,

            watch: {
                /*
                [name](state, newValue, oldValue) {
                    console.log('VUEX STATE CHANGED', state, newValue, oldValue)
                },/**/
            },

            mutations: {
                [VuexStorage.EVENT_UPDATE](state, payload) {
                    Object.assign(state, payload.data);
                },
            },

            actions: {
                [VuexStorage.EVENT_DELETE](context, name) {
                    // todo: context.delete(name)
                }
            }
        }
    }

    vuexStore(name) {
        if (!this._vuexStore) {
            this._vuexStore = this.makeVuexStore(name)
        }
        return this._vuexStore
    }
}

