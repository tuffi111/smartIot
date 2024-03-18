import {Storage} from './Storage'
import {useStore} from "vuex";

export class VuexStorage extends Storage {
    static EVENT_UPDATE = 'update:modelValue'

    _vuexStore

    makeStore() {
        return {
            load: () => {
                this.model().assignData(
                    this.vuexStore().state[this.storageKey()][this.model().name()]
                )
                return this
            },
            save: (data, oldData) => {
                this.vuexStore().commit(this.storageKey(this.model().name()) + '/' + VuexStorage.EVENT_UPDATE, {
                    model: this.model(),
                    data,
                    oldData,
                }) // see also: makeStoreModule().mutations
                return this
            }
        }
    }

    makeVuexStore() {
        const _store = useStore()

        if (!_store.hasModule(this.storageKey())) {
            _store.registerModule(this.storageKey(), this.makeStoreModule({}))
        }

        if (!_store.hasModule([this.storageKey(), this.model().name()])) {
            _store.registerModule([this.storageKey(), this.model().name()], this.makeStoreModule(this.model().data()))
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
                    payload.model.assignData(state)
                }
            },
        }
    }

    vuexStore() {
        if (!this._vuexStore) {
            this._vuexStore = this.makeVuexStore()
        }
        return this._vuexStore
    }
}

