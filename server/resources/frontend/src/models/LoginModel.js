import {Model} from "@app/models/Model.js";

export class LoginModel extends Model {
    constructor(data = {},name="LoginData") {
        super(name, Object.assign({
            email: '',
            password: '',
        }, data));
    }

    validations() {
        return {
            email: [],
            password:  [ val => val && val.length > 0 || 'Please type something']
        }
    }
}
