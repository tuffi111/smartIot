import {Model} from "@/models2/Model.js";
import {ApiStorage} from "@/models2/Storage/ApiStorage.js";
//import {apiRoute} from "@/backend-router.js";

export class ApiDataModel extends Model {

    name() {
        return 'MyApiFormData'
    }

    makeStorage() {
        return new ApiStorage()
        /*.routes({
            fetch: apiRoute('api.models.fetch'),
            update: apiRoute('api.models.update'),
        })/**/
    }

    autoUpdate() {
        return false
    }

    model() {
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
