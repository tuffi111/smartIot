import {Model} from "@app/models/Model.js";
import {LoginModel} from "@/models/LoginModel.js";

export class RegisterModel extends LoginModel {
    constructor(data = {}, name = "RegisterData") {
        super( Object.assign({
            name: '',
            password_confirmation: ''
        }, data), name);
    }

    validations() {
        return Object.assign(super.validations(), {
            name: [],
            password_confirmation: []
        });
    }
}
