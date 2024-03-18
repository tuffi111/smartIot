import {Model} from "@/models/Model.js";
import {LocalStorage} from "@/models/Storage/LocalStorage.js";


export class BrowserSettingsModel extends Model {

    makeStorage() {
        return new LocalStorage()
    }

    name() {
        return "BrowserSettings"
    }

    model() {
        return {
            theme: 'theme-name-AAAA',
            fontsize: 11,
            address: {street: '', zip: '', city: ''},
            tags: ['tag-1', 'tag-2', 'tag-3'],
            time: '22:00:00'
        }
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
