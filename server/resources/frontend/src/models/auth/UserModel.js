import {Model} from "@app/models/Model.js";

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
