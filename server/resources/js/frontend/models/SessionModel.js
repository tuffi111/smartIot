import {StorageModel} from "@/models/StorageModel.js";

export class SessionModel extends StorageModel
{
    name() {
        return 'SessionStorageModel'
    }

    store() {
        return window?.sessionStorage;
    }

}
