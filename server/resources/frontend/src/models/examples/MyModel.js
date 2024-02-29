import {VuexModel} from "@app/models/VuexModel.js";

export class MyModel extends VuexModel {
    constructor(data = {}) {
        super('MyFormData', Object.assign({
            tagList: {}
        }, data));
    }
}
