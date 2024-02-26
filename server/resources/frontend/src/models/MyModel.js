import {StoreModel} from "@app/models/StoreModel.js";

export class MyModel extends StoreModel {
    constructor(data = {}) {
        super('MyFormData', Object.assign({
            tagList: {}
        }, data));
    }
}
