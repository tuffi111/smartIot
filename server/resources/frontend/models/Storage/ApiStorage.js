import {Storage} from './Storage'
import {useApi} from "@/requests.js";
import {resolveRoute} from "@/backend-router.js";


export class ApiStorage extends Storage {

    static ROUTE_FETCH = 'fetch'
    static ROUTE_UPDATE = 'update'
    static ROUTE_DELETE = 'delete'

    apiHandler() {
        return [useApi()]
    }

    makeStore() {
        return {
            find: async (name, filter, order) => {
                return this.apiCall(this.route(name, ApiStorage.ROUTE_FETCH), {filter: filter.value, order: order.value})
            },
            save: async (name, data) => {
                return this.apiCall(this.route(name, ApiStorage.ROUTE_UPDATE), data)
            },
            delete: async (name) => {
                return this.apiCall(this.route(name, ApiStorage.ROUTE_DELETE))
            }
        }
    }

    routes(name) {
        return {
            [ApiStorage.ROUTE_FETCH]: resolveRoute('api.models.fetch', {model: name}),
            [ApiStorage.ROUTE_UPDATE]: resolveRoute('api.models.update', {model: name}),
            [ApiStorage.ROUTE_DELETE]: resolveRoute('api.models.delete', {model: name})
        }
    }

    route(name, action) {
        return this.routes(name)[action]
    }

    apiCall = async (route, data = {}, api = null, handlerQueue = null) => {
        if (!handlerQueue) {
            handlerQueue = Array.from(this.apiHandler())
        }

        if (!api) {
            api = handlerQueue.shift()
        }

        return api(route, data)
            .then((response) => {
                return response.data
            })
            .then((data) => {
                return data
            })
            .catch((error) => {
                if (handlerQueue.length) {
                    console.warn("API: " + route.uri + ": No valid api response. Trying next api handler.", error)
                    const api = handlerQueue.shift();
                    this.apiCall(route, data, api, handlerQueue)
                } else {
                    console.error("API: " + route.uri + ": No api handler left. Api update failed. Last error: ", error)
                    throw Error(error)
                }
            })
    }

}

