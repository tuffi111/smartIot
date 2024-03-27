import {Storage} from './Storage'
import {useApi} from "@/requests.js";
import {apiRoute, resolveRoute} from "@/backend-router.js";


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

    makeStore() {
        return {
            load: () => {
                const method = this.method(ApiStorage.ROUTE_FETCH)
                const route = this.route(ApiStorage.ROUTE_FETCH, this.model().name())
                return this.apiCall(method, route)
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
                const method = this.method(ApiStorage.ROUTE_UPDATE)
                const route = this.route(ApiStorage.ROUTE_UPDATE, this.model().name())
                return this.apiCall(method, route, data)
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
        return this.routes()[action].methods[0].toUpperCase()
    }

    route(action, name = null) {
        return this.escapeRoute(resolveRoute(this.routes()[action].name)) + '/' + name ?? this.model().name()
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


    apiCall = async (method, route, data = {}, api = null, handlerQueue = null) => {
        if (!handlerQueue) {
            handlerQueue = Array.from(this.apiHandler())
        }

        if (!api) {
            api = handlerQueue.shift()
        }

        this.loading(true)
        return api(route, Object.assign({
            method,
            data
        }))
            .then((response) => {
                return response.data
            })
            .then((data) => {
                return data
            })
            .catch((error) => {
                if (handlerQueue.length) {
                    console.warn("API: " + route + ": No valid api response. Trying next api handler.", error)
                    const api = handlerQueue.shift();
                    this.apiCall(method, route, data, api, handlerQueue)
                } else {
                    console.error("API: " + route + ": No api handler left. Api update failed. Last error: ", error)
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

