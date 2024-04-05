import {Model} from "@/models/Model.js";
import {ApiStorage} from "@/models/Storage/ApiStorage.js";

export class User extends Model {
    name(){
        return 'User'
    }

    model(){
        return {
            email: '',
        }
    }

    makeStorage() {
        return new ApiStorage()
    }
}
