import {Model} from "@/models/Model.js";
import {email, minMaxLength, required} from "@/rules.js";

export class LoginModel extends Model {
    name(){
        return 'LoginData'
    }
    model(){
        return {
            email: '',
            password: '',
            stayAuth: false,
        }
    }

    validations() {
        return {
            email: [
                required(),
                email(),
                minMaxLength(3, 255),
            ],
            password: [
                required(),
            ]
        }
    }

}
