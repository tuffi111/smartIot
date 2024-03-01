import {LocalModel} from "@app/models/LocalModel.js";


export class LocalDataModel extends LocalModel {

    constructor(data = {}) {
        super(Object.assign({
            theme: 'LOCAL-theme',
            type: 2,
            address: {street: 'bbb', zip: 'bbb222', city: 'bbb222bbb'},
            tags: {"tag-2":'tag-2', "tag-22":'tag-22', "tag-222":'tag-222'},
            rights: ['read','write'],
            time: '12:00:00'
        }, data), name);

    }/**/

    name() {
        return "LocalData"
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
