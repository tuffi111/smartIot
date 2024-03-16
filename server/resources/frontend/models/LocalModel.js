import {StorageModel} from "@/models/StorageModel.js";

export class LocalModel extends StorageModel
{
    name() {
        return 'LocalStorageModel'
    }

    store() {
        return window?.localStorage;
    }
}
