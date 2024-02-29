import {VuexModel} from "@app/models/VuexModel.js";

export class MyVueXModel extends VuexModel {
    constructor(data = {}) {
        super(Object.assign({
            fontsize: 0,
            tagList: [],
            address: {street: '', zip: '', city: ''}
        }, data));
    }

    name() {
        return 'MyVueXModel'
    }
}
