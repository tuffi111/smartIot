import {Model} from "@/models/Model.js";
import {useModelStore} from "@/models/VuexModelStore.js";

const modelStore = useModelStore()


export class VuexModel extends Model {
    static storeStateName = 'modelStore'
    static updateEvent = 'update:modelValue'
    static defaultStore = null
    _storage = null

    constructor(data = {}) {
        super()
        this.storage(modelStore)
        this.storage().update(Object.assign({}, this.model(), data))
    }


    name() {
        return 'VuexModel'
    }


    storage(set = null) {
        if (set) {
            this._storage = set
            return this
        }

        return {
            data: () => {
                return this._storage.state(this)
            },
            update: (data, oldData) => {
                this._storage.commit(this, data, oldData)
            }
        }
    }


    data(set = undefined) {
        if (set === undefined) {
            return this.storage().data()
        }

        this.storage().update(set, this.storage().data())
        return this
    }

    set(dataOrKeyChain, value = undefined) {
        if (value !== undefined) {
            this.data({[dataOrKeyChain]: value})
            return this
        }

        this.data(dataOrKeyChain);
        return this
    }
}
