import {VuexModel} from "@app/models/VuexModel.js";

export class MyVueXModel extends VuexModel {

    name() {
        return 'MyVueXModel'
    }

    model(){
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
