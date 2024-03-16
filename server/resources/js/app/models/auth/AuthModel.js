import {CookieModel} from "@/models/CookieModel.js";

export class AuthModel extends CookieModel {
    name(){
        return 'AuthData'
    }

    model(){
        return {
            token: '',
        }
    }
}
