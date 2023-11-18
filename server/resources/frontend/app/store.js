import {createStore as createStoreModel} from "./models/StoreModel.js";


export function createStore(options={}) {
    return createStoreModel(options);
}


