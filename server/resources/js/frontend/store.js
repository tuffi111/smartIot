import {createStore as createModelStore} from "./models/VuexModelStore.js";


export function createStore(options={}) {
    return createModelStore(options);
}


