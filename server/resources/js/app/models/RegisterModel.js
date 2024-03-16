import {contains, email, equals, minMaxLength, required} from "@/rules.js";
import {validatePassword} from "@/rules/password.ts";
import {Model} from "@/models/Model.js";

export class RegisterModel extends Model {

    name() {
        return 'RegisterModel'
    }

    model() {
        return {
            email: '',
            firstname: '',
            lastname: '',
            password: '',
            password_confirmation: '',
            accepted: [],
        }
    }

    _validations = {
        email: [required(), email(), minMaxLength()],
        firstname: [required(), minMaxLength()],
        lastname: [required(), minMaxLength()],
        password: [required(), validatePassword()],
        password_confirmation: [required(), minMaxLength(), equals(this.data('password'), 'The confirmation does not match.')],
        accepted: [required(), contains('agb', 'AGB should be accepted')],
    }

}
