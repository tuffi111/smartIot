import {ApiModel} from "@app/models/ApiModel.js";

export class ApiDataModel extends ApiModel {
    constructor(data = {}) {
        super(Object.assign({
            theme: 'ApiModel-theme',
            type: 3,
            address: {street: 'ccc', zip: 'ccc333', city: 'ccc333ccc'},
            tags: {'tag-3': 'tag-3', 'tag-33': 'tag-33', 'tag-333': 'tag-333'},
            rights: ['read', 'write'],
            time: '13:00:00'
        }, data))
    }

    name() {
        return 'MyApiFormData'
    }

}
