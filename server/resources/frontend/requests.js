import axios from "axios";
import {authData} from "@/auth.js";
import {config} from "dotenv";
import {indexOf} from "@/utils.js";

class Request {

    _options = {}
    _xhr

    constructor(options = {}) {
        this._options = options
    }

    makeXhr() {
        return axios.create(this.options())
    }

    xhr() {
        if (!this._xhr) {
            this._xhr = this.makeXhr()
        }

        return this._xhr
    }

    fetch(route, data = undefined) {
        const options = this.methodFromRoute(route, Object.assign( this.options(), {
            url: this.uriFromRoute(route)
        }))

        if (data!==undefined) {
            if(options['method'].toLowerCase() ==='get'){
                options['params'] = data
            }else{
                options['data'] = data
            }
        }

        return this.xhr().request(options)
    }

    options() {
        return this._options
    }

    uriFromRoute(route) {
        if (typeof route === 'object'
            && !Array.isArray(route)
            && route['uri']
        ) {
            return this.escapeRoute(route['uri'])
        }

        return this.escapeRoute(route)
    }

    methodFromRoute(route, config = {}) {
        if (typeof route === 'object'
            && !Array.isArray(route)
            && route['methods']
        ) {
            if ('methods' in route && route['methods'] && Array.isArray(route['methods'])) {
                let method
                if (indexOf(route['methods'], 'get') >= 0) {
                    method = 'GET'
                } else if (indexOf(route['methods'], 'post') >= 0) {
                    method = 'POST'
                } else if (indexOf(route['methods'], 'put') >= 0) {
                    method = 'PUT'
                } else if (indexOf(route['methods'], 'delete') >= 0) {
                    method = 'DELETE'
                } else if (indexOf(route['methods'], 'options') >= 0) {
                    method = 'OPTIONS'
                } else if (indexOf(route['methods'], 'trace') >= 0) {
                    method = 'TRACE'
                } else if (indexOf(route['methods'], 'patch') >= 0) {
                    method = 'PATCH'
                } else if (indexOf(route['methods'], 'connect') >= 0) {
                    method = 'CONNECT'
                } else if (indexOf(route['methods'], 'head') >= 0) {
                    method = 'HEAD'
                }

                if (method) {
                    config = Object.assign({method}, config)
                }
            }

            return config
        }
    }


    escapeRoute(path) {
        return path.trim().replace(/[\/|\\]+$/, ''); //$ marks the end of a string. [\/|\\]+$ means: all / or \ characters at the end of a string
    }
}


class RequestApi extends Request {

    fetch(route, request = undefined) {
        return super.fetch(route, request)
    }

    makeXhr() {
        const xhr = super.makeXhr()
        xhr.interceptors.request.use(this.withAuthorizationHeader)
        return xhr
    }

    withAuthorizationHeader(config) {
        //authData().wait()
        let token = authData().get('token')
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config
    }

}


let _requestInstance = {}

function requestInstance(from) {

    if (!(from in _requestInstance)) {
        console.log("import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL)
        switch (from) {
            case 'api':
                _requestInstance[from] = new RequestApi({
                    baseURL: import.meta.env.VITE_API_URL,
                    timeout: 1000,
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                })
                break;
            default:
                _requestInstance[from] = new Request({
                    baseURL: import.meta.env.VITE_APP_URL,
                    timeout: 1000,
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                })
        }
    }
    return _requestInstance[from]
}

export function useHttp() {
    return (route, data = undefined) => {
        return requestInstance('http').fetch(route, data)
    }
}

export function useApi() {
    return (route, data = undefined, ...args) => {
        return requestInstance('api').fetch(route, data)
    }
}

export default {
    useApi,
    useHttp,
}
