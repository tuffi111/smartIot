import {StoreModel} from "@app/models/StoreModel";

export class MyModel extends StoreModel {
    constructor(data = {}) {
        super('MyFormData', Object.assign({tagList: {}}, data));
    }
}