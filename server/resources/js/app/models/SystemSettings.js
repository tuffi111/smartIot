import {Model} from "@/models/Model.js";
import {LocalStorage} from "@/models/Storage/LocalStorage.js";


export class SystemSettings extends Model {

    makeStorage() {
        return new LocalStorage()
    }

    name() {
        return "System"
    }

    model() {
        return {
            themeMode: false,
            fontsize: 10,
        }
    }
}
