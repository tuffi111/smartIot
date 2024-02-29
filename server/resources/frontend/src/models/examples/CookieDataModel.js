import {CookieModel} from "@app/models/CookieModel.js";


export class CookieDataModel extends CookieModel {

    constructor(data = {}) {
        super(Object.assign({
            theme: 'theme-name-BBBB',
            fontsize: 33,
            address: {street: '', zip: '', city: ''},
            tags: ['tag-1','tag-2','tag-3'],
            time: '22:00:00'
        }, data), name);

    }/**/

    name(){
        return "CookieData"
    }

    validations() {
        return {
            //    email: [],
            //  password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
