import {email, minMaxLength, required} from "@app/rules.js";
import {validatePassword} from "@app/rules/password.ts";
import {Model} from "@app/models/Model.js";

export class RegisterModel extends Model {

    name() {
        return 'RegisterModel'
    }

    model() {
        return {
            email: '',
            name: '',
            password: '',
            password_confirmation: '',
        }
    }

    validations() {
        return {
            email: [required(), email(), minMaxLength()],
            name: [required(), minMaxLength()],
            password: [required(), validatePassword()],
            password_confirmation: [required(), minMaxLength()]
        }
    }
}
