import {Model} from "@/models2/Model.js";
import {LocalStorage} from "@/models2/Storage/LocalStorage.js";

export class LocalDataModel extends Model {

    name(){
      return 'LocalData'
    }

    makeStorage() {
        return new LocalStorage()
    }

    model(){
        return {
        theme: 'LOCAL-theme',
        type: 2,
        address: {street: 'bbb', zip: 'bbb222', city: 'bbb222bbb'},
        tags: {"tag-2": 'tag-2', "tag-22": 'tag-22', "tag-222": 'tag-222'},
        rights: ['read', 'write'],
        time: '12:00:00'
        }
    }

    validations() {
        return {
        //    email: [],
        //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
