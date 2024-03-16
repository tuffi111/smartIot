import {Storage} from './Storage'
import {useStore} from "vuex";

export class VuexStorage extends Storage {
    static EVENT_UPDATE = 'update:modelValue'

    _vuexStore

    makeStore(name, data) {
        return {
            load: (name) => {
                this.vuexStore().state[this.storageKey()][name] = data
                return this.vuexStore().state[this.storageKey()][name]
            },
            save: (name, data, oldData) => {
                this.vuexStore().commit(this.storageKey(name) + '/' + VuexStorage.EVENT_UPDATE, {
                    name, data, oldData
                }) // see also: makeStoreModule().mutations
                return this
            }
        }
    }

    makeVuexStore(data = {}) {
        const _store = useStore()

        if (!_store.hasModule(this.storageKey())) {
            _store.registerModule(this.storageKey(), this.makeStoreModule({}))
        }

        _store.registerModule([this.storageKey(), this.name()], this.makeStoreModule(data))
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
                }, /**/
            },
        }
    }

    vuexStore() {
        if (!this._vuexStore) {
            this._vuexStore = this.makeVuexStore(this.data())
        }
        return this._vuexStore
    }
}

