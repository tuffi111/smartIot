import {Model} from "@/models/Model.js";

export class UserModel extends Model {
    name(){
        return 'AuthUserData'
    }

    model(){
        return {
            token: '',
        }
    }
}
