import {useApi} from "@/requests.js";
import {StorageModel} from "@/models/StorageModel.js";


export class ApiModel extends StorageModel {

    constructor(...args) {
        super(...args);
        this._apiHandler = [useApi()]
    }

    name() {
        return 'ApiModel'
    }

    route(path = '') {
        return 'models/' + path
    }

    endpoints() {
        return {
            'fetch': '',
            'update': ''
        }
    }

    autoUpdate(){
        return false
    }

    apiHandler() {
        return [useApi()]
    }

    setStorageData(data) {
        if (!this.withApiUpdate()) return false;
        return this.apiCall('POST', this.endpoints().update, data,
            (data) => {
                this.withApiUpdate(false)
                this.set(data)
            },
            (error) => {
                this.raiseError("ApiModel/" + this.name() + ": No api update possible. Last error: ", error);
            })
    }

    getStorageData() {
        return this.apiCall('GET', this.endpoints().fetch, null,
            (data) => {
                this.withApiUpdate(false)
                this.set(data)
            },
            (error) => {
                this.raiseError("ApiModel/" + this.name() + ": No api update possible. Last error: ", error);
            })
    }

    storage() {
        return {
            update: (data) => {
                if (this.withApiUpdate()) {
                    this.setStorageData(data)
                }
                this.resetApiUpdate()
                return this
            },
            data: () => {
                return this.getStorageData()
            }
        }
    }


    apiCall = (method, endpoint, data, onSuccess = null, onError = null, api = null, handlerQueue = null) => {
        if (!handlerQueue) {
            handlerQueue = Array.from(this.apiHandler())
        }

        if (!api) {
            api = handlerQueue.shift()
        }

        const route = this.makeRoute(endpoint);
        return api(route, Object.assign({
            method,
            data
        }))
            .then((response) => {
                return response.data
            })
            .then((data) => {
                if (onSuccess) {
                    onSuccess(data)
                }
                return data
            })
            .catch((error) => {
                if (handlerQueue.length) {
                    console.warn("API: " + route + ": No valid api response. Trying next api handler.", error)
                    const api = handlerQueue.shift();
                    this.apiCall(method, endpoint, data, onSuccess, onError, api, handlerQueue)
                } else {
                    console.error("API: " + route + ": No api handler left. Api update failed. Last error: ", error)
                    if (onError) {
                        onError(error)
                    } else {
                        this.raiseError("API: " + route + ": No api update possible. Last error: ", error);
                    }
                }
                return error
            })
    }


    makeRoute(endpoint, model = null) {
        let name;
        if (model) {
            name = model.name();
        } else {
            name = this.name();
        }

        return "{0}/{1}/{2}".format(
            this.escapeRoute(this.route()),
            this.escapeRoute(name),
            endpoint
        )
    }

    escapeRoute(path) {
        return path.trim().replace(/[\/|\\]+$/, ''); //$ marks the end of a string. [\/|\\]+$ means: all / or \ characters at the end of a string
    }
}
