import {ApiModel} from "@/models/ApiModel.js";

export class ApiDataModel extends ApiModel {

    name() {
        return 'MyApiFormData'
    }

    autoUpdate(){
        return false
    }

    model(){
        return {
        theme: 'ApiModel-theme',
        type: 3,
        address: {street: 'ccc', zip: 'ccc333', city: 'ccc333ccc'},
        tags: {'tag-3': 'tag-3', 'tag-33': 'tag-33', 'tag-333': 'tag-333'},
        rights: ['read', 'write'],
        time: '13:00:00'
        }
    }

    validations() {
        return {
        //    email: [],
        //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
