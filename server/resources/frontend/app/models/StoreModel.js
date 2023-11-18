import {createStore as vuexCreateStore, useStore} from 'vuex'

/**
 * ## Install (main.frontend):
 * import {createStore} from 'vuex'
 * import {StoreModel} from "@/VuexModel"
 *
 * const store = createStore({})
 * StoreModel.registerTo( store, { "FormData": { "formFieldValue1": 111, "formFieldValue2": 222 }})
 *
 *
 * ## Usage
 * <script setup>
 *  import {StoreModel} from '@/VuexModel'
 *  import ModelData from "@/ModelView.vue"
 *  const Form = new StoreModel( "FormData', { "formFieldValue1": 999 })     // vuex store.state => { "modelStore": { "FormData": { "formFieldValue1": 999, "formFieldValue2": 222 }}}
 * </script>
 *
 * <template>
 *  <model-data v-model="Form.data" @update:modelValue="Form.update($event)">
 *    <template v-slot="{ data }">
 *       <input type="text" v-model="data.formFieldValue1">
 *       === {{ data.formFieldValue1 }}
 *       <hr>
 *       <input type="text" v-model="data.formFieldValue2">
 *       === {{ data.formFieldValue2 }}
 *     </template>
 *  </model-data>
 * </template>
 */

export function createStore(options = {}) {
    const store = vuexCreateStore(options)
    StoreModel.registerTo(store)
    return store
}

export class StoreModel {
    static storeStateName = 'modelStore'
    static updateEvent = 'update:modelValue'
    static defaultStore = null
    data = null;
    errorHandler = [];


    constructor(name, data = {}) {
        this.store(StoreModel.defaultStore ?? useStore())

        if (data) {
            this.store().state[StoreModel.storeStateName][name] = Object.assign({}, this.store().state[StoreModel.storeStateName][name], data)
        }

        this.name(name)
    }

    static registerTo(store, data = null) {
        StoreModel.defaultStore = store;
        store.registerModule(
            [StoreModel.storeStateName],
            StoreModel.storeModule(Object.assign({}, store.state[StoreModel.storeStateName], data))
        )
    }

    static storeModule(data) {
        return {
            namespaced: true,
            state: () => StoreModel.state(data),
            mutations: {
                [StoreModel.updateEvent](state, event) {
                    state[event.model.name()] = event.model.beforeUpdate(event.data);
                }
            },
        }
    }

    static state(data) {
        return data;
    }

    beforeUpdate(data) {
        return data;
    }

    name(set = null) {
        if (set === null) {
            return this._name
        }
        this._name = set
        this.refresh()
        return this;
    }

    store(set = null) {
        if (set === null) {
            return this._store
        }
        this._store = set
        this.refresh()
        return this;
    }

    setData(set) {
        this.data = set
        return this;
    }

    refresh() {
        if (this.store() && this.name()) {
            this.setData(
                this.store().state[StoreModel.storeStateName][this.name()]
            )
        }
    }

    update(data) {
        console.log('====> Model update');
        this.store().commit(StoreModel.storeStateName + '/' + StoreModel.updateEvent, {data: data, model: this})
        this.setData(data)
    }


    onErrors(handler) {
        this.errorHandler.push(handler)
    }

    raiseError(error) {
        for (const idx in this.errorHandler) {
            this.errorHandler[idx](error);
        }
    }
}
