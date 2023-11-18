import {ApiModel} from "@app/models/ApiModel";

export class MyApiModel extends ApiModel {
    constructor(data = {}) {
        super('MyApiFormData', Object.assign({tagList: {}}, data))
    }
}