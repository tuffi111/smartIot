import {Storage} from './Storage'
import {useApi} from "@/requests.js";
import {apiRoute, resolveRoute} from "@/backend-router.js";


export class ApiStorage extends Storage {


    makeRoutes() {
        return {
            fetch: apiRoute('api.models.fetch'),
            update: apiRoute('api.models.update')
        }
    }

    apiHandler() {
        return [useApi()]
    }

    route(){
        return resolveRoute(this.routes().fetch.name)+'/'+this.name()
    }

    method(){
        return this.routes().fetch.methods[0].toUpperCase()
    }

    makeStore(name, data) {
        const store = {[this.storageKey()]: data}

        return {
            load: (name) => {

                const method = this.method()
                const route = this.route()

                console.log('=========================================================')
                console.log('API-CALL:', method, route)
                console.log('=========================================================')

                return this.apiCall(method, route)
                    .then((data) => {
                        console.log('API-CALL-RESPONSE:', data)
                        //this.withApiUpdate(false)
                        //this.set(data)
                    })
                    .catch((error) => {
                        console.warn('API-CALL-ERROR:', error)
                        //this.raiseError("ApiModel/" + this.name() + ": No api update possible. Last error: ", error);
                    })
            },
            save: (name, data) => {
                store[this.storageKey()][name] = data
                return this
            }
        }
    }

    get(name) {
        try {
            return this.store().load(name)
        } catch (error) {
            return {}
        }
    }

    set(name, data) {
        this.store().save(name, data)
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


    apiCall = (method, route, data = {}, onSuccess = null, onError = null, api = null, handlerQueue = null) => {
        if (!handlerQueue) {
            handlerQueue = Array.from(this.apiHandler())
        }

        if (!api) {
            api = handlerQueue.shift()
        }

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
                    } else {
                        //this.raiseError("API: " + route + ": No api update possible. Last error: ", error);
                    }
                }
                return error
            })
    }


}

