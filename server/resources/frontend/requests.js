import axios from "axios";
import {authData} from "@/auth.js";

let http;
let api;
const indexOf = (arr, q) => arr.findIndex(item => q.toLowerCase() === item.toLowerCase());

export function uriFromRoute(route) {
    if (typeof route === 'object'
        && !Array.isArray(route)
        && route['uri']
    ) {
        return route['uri']
    }

    return escapeRoute(route)
}

export function methodFromRoute(route, config = {}) {
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

const withAuthorizationHeader = (config) => {
    let token = authData().get('token')

    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config
}

const setup = (app, options = {}) => {
    api = axios.create(Object.assign({}, {
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 1000,
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }, options));
    api.interceptors.request.use(withAuthorizationHeader);

    http = axios.create(Object.assign({}, {
        baseURL: import.meta.env.VITE_APP_URL,
        timeout: 1000,
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }, options));
}

const escapeRoute = (path) => {
    return path.trim().replace(/[\/|\\]+$/, ''); //$ marks the end of a string. [\/|\\]+$ means: all / or \ characters at the end of a string
}


const useHttp = () => {
    return (route, config = {}, ...args) => {
        return http(uriFromRoute(route), methodFromRoute(route, config), ...args);
    }
}

const useApi = () => {
    return (route, config = {}, ...args) => {
        return api(uriFromRoute(route), methodFromRoute(route, config), ...args);
    }
}

export {
    setup,
    useApi,
    useHttp
}

export default {
    setup,
    useApi,
    useHttp
}
