import {VuexModel} from "@app/models/VuexModel.js";

export class MyVueXModel extends VuexModel {
    constructor(data = {}) {
        super(Object.assign({
            theme: 'theme-name-333',
            fontsize: 33,
            address: {street: '', zip: '', city: ''},
            tags: ['tag-7','tag-8','tag-9'],
            time: '11:00:00'
        }, data), name);
    }

    name() {
        return 'MyVueXModel'
    }
}
