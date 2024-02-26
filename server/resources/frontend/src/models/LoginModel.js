import {Model} from "@app/models/Model.js";

export class LoginModel extends Model {
    constructor(data = {}) {
        super('LoginData', Object.assign({
            email: '',
            password: ''
        }, data));
    }
}
