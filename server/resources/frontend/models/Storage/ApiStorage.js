import {Storage} from './Storage'
import {useRoute} from 'vue-router'
import {useApi, uriFromRoute, methodFromRoute} from "@/requests.js";
import {resolveRoute} from "@/backend-router.js";

const route = useRoute();

export class ApiStorage extends Storage {

    static ROUTE_FETCH = 'fetch'
    static ROUTE_UPDATE = 'update'


    makeRoutes() {
        return {
            [ApiStorage.ROUTE_FETCH]: resolveRoute('api.models.fetch', {model: this.model().name()}),
            [ApiStorage.ROUTE_UPDATE]: resolveRoute('api.models.update', {model: this.model().name()})
        }
    }

    apiHandler() {
        return [useApi()]
    }

    makeStore() {
        return {
            load: () => {
                return this.apiCall(this.routes()[ApiStorage.ROUTE_FETCH])
                    .then((data) => {
                        console.table(data)
                        this.model().assignData(data)
                        return data
                    })
                    .catch((error) => {
                        //console.warn('API-GET-CALL-ERROR:', error)
                        return error
                    })
            },
            save: (data) => {
                return this.apiCall(this.routes()[ApiStorage.ROUTE_UPDATE], data)
                    .then((data) => {
                        this.model().assignData(data)
                        return data
                    })
                    .catch((error) => {
                        //console.warn('API-SAVE-CALL-ERROR:', error)
                        return error
                    })
            }
        }
    }

    method(action) {
        return methodFromRoute(this.routes()[action])
    }

    route(action, name = null) {
        return this.escapeRoute(uriFromRoute(this.routes()[action]))
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


    apiCall = async (route, data = {}, api = null, handlerQueue = null) => {
        if (!handlerQueue) {
            handlerQueue = Array.from(this.apiHandler())
        }

        if (!api) {
            api = handlerQueue.shift()
        }

        this.loading(true)
        return api(route, {data})
            .then((response) => {
                return response.data
            })
            .then((data) => {
                return data
            })
            .catch((error) => {
                if (handlerQueue.length) {
                    console.warn("API: " + uri + ": No valid api response. Trying next api handler.", error)
                    const api = handlerQueue.shift();
                    this.apiCall(route, data, api, handlerQueue)
                } else {
                    console.error("API: " + uri + ": No api handler left. Api update failed. Last error: ", error)
                    throw Error(error)
                }
            }).finally(() => {
                this.loading(false)
            })
    }

}

