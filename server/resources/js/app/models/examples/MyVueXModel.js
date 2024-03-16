import {Model} from "@/models2/Model.js";
import {VuexStorage} from "@/models2/Storage/VuexStorage.js";

export class MyVueXModel extends Model {

    name() {
        return 'MyVueXModel'
    }

    makeStorage() {
        return new VuexStorage()
    }

    model() {
        return {
            theme: 'VueModel-theme',
            type: 5,
            address: {street: 'eee', zip: 'eee555', city: 'eee555eee'},
            tags: {'tag-5': 'tag-5', 'tag-55': 'tag-55', 'tag-555': 'tag-555'},
            rights: ['read', 'write'],
            time: '15:00:00'
        }
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
