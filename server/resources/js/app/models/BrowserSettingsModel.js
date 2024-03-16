import {LocalModel} from "@/models/LocalModel.js";


export class BrowserSettingsModel extends LocalModel {

    constructor(data = {}) {
        super(Object.assign({
        theme: 'theme-name-AAAA',
        fontsize: 11,
        address: {street: '', zip: '', city: ''},
        tags: ['tag-1', 'tag-2', 'tag-3'],
        time: '22:00:00'
        }, data), name);

    }/**/

    name(){
        return "BrowserSettings"
    }

    validations() {
        return {
        //    email: [],
        //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
