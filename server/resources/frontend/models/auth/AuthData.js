import {CookieModel} from "@/models/CookieModel.js";

export class AuthData extends CookieModel {
    name(){
        return 'AuthData'
    }

    model(){
        return {
            token: '',
        }
    }
}
