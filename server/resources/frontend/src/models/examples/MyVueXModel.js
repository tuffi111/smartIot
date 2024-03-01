import {VuexModel} from "@app/models/VuexModel.js";

export class MyVueXModel extends VuexModel {
    constructor(data = {}) {
        super(Object.assign({
            theme: 'VueModel-theme',
            type: 5,
            address: {street: 'eee', zip: 'eee555', city: 'eee555eee'},
            tags: {'tag-5':'tag-5', 'tag-55':'tag-55', 'tag-555':'tag-555'},
            rights: ['read','write'],
            time: '15:00:00'
        }, data), name);
    }

    name() {
        return 'MyVueXModel'
    }
}
