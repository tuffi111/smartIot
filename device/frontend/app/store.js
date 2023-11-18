import {createStore as createStoreModel} from "./models/StoreModel";


export function createStore(options={}) {
    return createStoreModel(options);
}


