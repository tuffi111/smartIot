import {StoreModel} from "./StoreModel";


/**
 * ## Install (main.frontend):
 * import {createStore} from 'vuex'
 * import {StoreModel} from "@/VuexModel"
 *
 * const store = createStore({})
 * StoreModel.registerTo( store, { "FormData": { "formFieldValue1": 111, "formFieldValue2": 222 }})
 *
 *
 * ## Usage
 * <script setup>
 *  import {StoreModel} from '@/VuexModel'
 *  import ModelData from "@/ModelView.vue"
 *  const Form = new StoreModel( "FormData', { "formFieldValue1": 999 })     // vuex store.state => { "modelStore": { "FormData": { "formFieldValue1": 999, "formFieldValue2": 222 }}}
 * </script>
 *
 * <template>
 *  <model-data v-model="Form.data" @update:modelValue="Form.update($event)">
 *    <template v-slot="{ data }">
 *       <input type="text" v-model="data.formFieldValue1">
 *       === {{ data.formFieldValue1 }}
 *       <hr>
 *       <input type="text" v-model="data.formFieldValue2">
 *       === {{ data.formFieldValue2 }}
 *     </template>
 *  </model-data>
 * </template>
 */

class Api {
    available() {
        return true;
    }
}

class ApiWs extends Api {

    send(event, data) {
        console.log('Api::WS: send', event, data);
        return fetch(event);
    }
}

class ApiXhr extends Api {
    send(event, data) {
        console.log('Api::XHR: send', event, data);
        return fetch(event);
    }
}


export class ApiModel extends StoreModel {


    _ws = new ApiWs();
    _xhr = new ApiXhr();
    static METHOD_GET = 'GET';
    static METHOD_POST = 'POST';

    constructor(name, data = null, route = 'models') {
        super(name, data);
        this._route = route;
    }

    fetch(data) {
        this.api('get', data, ApiModel.METHOD_GET, (data) => {
            super.update(data);
        });
    }

    update(data) {
        this.api('update', data, ApiModel.METHOD_POST, (data) => {
            super.update(data);
        });
    }

    api(event, data, method = ApiModel.METHOD_GET, onSuccess = null, onError = null) {
        const handlerQueue = this.getHandler();
        if (handlerQueue && Array.isArray(handlerQueue) && handlerQueue.length) {
            const api = handlerQueue.shift();
            this.apiCall(api, method, event, data, handlerQueue, onSuccess, onError)
        } else {
            super.update(data);
        }
    }

    apiCall(api, method, event, data, handlerQueue, onSuccess = null, onError = null) {
        api.send(this.makeRoute(event), data)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log('ApiModel/' + event + ': api response:', data)
                if (onSuccess) {
                    onSuccess(data)
                }
            })
            .catch((error) => {
                if (handlerQueue.length) {
                    console.warn("ApiModel/" + event + " error while api access; try next api handler. Error: ", error)
                    const api = handlerQueue.shift();
                    this.apiCall(api, method, event, data, handlerQueue, onSuccess, onError)
                } else {
                    console.error("ApiModel/" + event + ": No api handler left. Api update failed. Last error: ", error)
                    if (onError) {
                        onError(error)
                    } else {
                        this.raiseError("ApiModel/" + event + ": No api update possible. Last error: ", error);
                    }
                }
            });
    }

    getHandler() {
        let apiHandler = [];
        if (this.ws().available()) {
            apiHandler.push(this.ws());
        }

        if (this.xhr().available()) {
            apiHandler.push(this.xhr());
        }

        return apiHandler;
    }


    makeRoute(event) {
        return "{0}/{1}/{2}".format(
            this.escapeRoute(this._route),
            this.escapeRoute(this.name()),
            event
        )
    }


    escapeRoute(path) {
        return path.trim().replace(/[\/|\\]+$/, ''); //$ marks the end of a string. [\/|\\]+$ means: all / or \ characters at the end of a string
    }


    ws() {
        return this._ws;
    }

    xhr() {
        return this._xhr;
    }

}
