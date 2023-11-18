import {ApiModel} from "@app/models/ApiModel.js";

export class MyApiModel extends ApiModel {
    constructor(data = {}) {
        super('MyApiFormData', Object.assign({tagList: {}}, data))
    }
}
