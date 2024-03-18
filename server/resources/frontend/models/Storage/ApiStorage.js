import {Storage} from './Storage'
import {useApi} from "@/requests.js";
import {apiRoute, resolveRoute} from "@/backend-router.js";
import {reactive, ref} from "vue";


export class ApiStorage extends Storage {

    static ROUTE_FETCH = 'fetch'
    static ROUTE_UPDATE = 'update'


    makeRoutes() {
        return {
            [ApiStorage.ROUTE_FETCH]: apiRoute('api.models.fetch'),
            [ApiStorage.ROUTE_UPDATE]: apiRoute('api.models.update')
        }
    }

    apiHandler() {
        return [useApi()]
    }

    route(action, name = null) {
        return this.escapeRoute(resolveRoute(this.routes()[action].name)) + '/' + name ?? this.model().name()
    }

    method(action) {
        return this.routes()[action].methods[0].toUpperCase()
    }

    makeStore() {
        return {
            load: () => {
                const method = this.method(ApiStorage.ROUTE_FETCH)
                const route = this.route(ApiStorage.ROUTE_FETCH, this.model().name())
                console.info('API-GET-CALL:', method, route)
                return this.apiCall(method, route)
                    .then((data) => {
                        console.log('API-GET-CALL-RESPONSE:', data)
                        console.table(data)
                        this.model().assignData(data, false)
                        this.raise(ApiStorage.EVENT_CHANGED, data)
                    })
                    .catch((error) => {
                        console.warn('API-GET-CALL-ERROR:', error)
                        //this.raiseError("ApiModel/" + this.model().name() + ": No api update possible. Last error: ", error);
                    })
            },
            save: (data) => {
                const method = this.method(ApiStorage.ROUTE_UPDATE)
                const route = this.route(ApiStorage.ROUTE_UPDATE, this.model().name())
                console.info('API-SET-CALL:', method, route, data)
                return this.apiCall(method, route, data)
                    .then((data) => {
                        console.log('API-SAVE-CALL-RESPONSE:', data)
                        this.model().assignData(data, false)
                        this.raise(ApiStorage.EVENT_CHANGED, data)
                    })
                    .catch((error) => {
                        console.warn('API-SAVE-CALL-ERROR:', error)
                        //this.raiseError("ApiModel/" + this.model().name() + ": No api update possible. Last error: ", error);
                    })
            }
        }
    }

    get() {
        try {
            return this.store().load()
        } catch (error) {
            return {}
        }
    }

    set(data) {
        return this.store().save(data)
    }

    routes(set = null) {
        if (set) {
            this._routes = set
            return this

        }

        if (!this._routes) {
            this._routes = this.makeRoutes()
        }

        return this._routes
    }


    apiCall = async (method, route, data = {}, onSuccess = null, onError = null, api = null, handlerQueue = null) => {
        if (!handlerQueue) {
            handlerQueue = Array.from(this.apiHandler())
        }

        if (!api) {
            api = handlerQueue.shift()
        }

        this.loading(true)
        //const route = this.makeRoute(endpoint);
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
                    }
                    //this.raiseError("API: " + route + ": No api update possible. Last error: ", error);
                    throw Error(error)
                }
            }).finally(() => {
                this.loading(false)
            })
    }

    escapeRoute(path) {
        return path.trim().replace(/[\/|\\]+$/, ''); //$ marks the end of a string. [\/|\\]+$ means: all / or \ characters at the end of a string
    }

}

