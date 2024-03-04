import {VuexModel} from "@app/models/VuexModel.js";

export class MyFormData extends VuexModel {

    name() {
        return 'MyFormData'
    }

    model(){
        return {
            theme: 'MyModel-theme',
            type: 4,
            address: {street: 'ddd', zip: 'ddd444', city: 'ddd444ddd'},
            tags: {'tag-4':'tag-4', 'tag-44':'tag-44', 'tag-444':'tag-444'},
            rights: ['read','write'],
            time: '14:00:00'
        }
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
