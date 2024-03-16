import axios from "axios";
import {authData} from "@/auth.js";

let http;
let api;

const withAuthorizationHeader = (config) => {
    //let token = localStorage.getItem('token');
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


const useHttp = () => {
    return http;
}

const useApi = () => {
    return api;
}

export {
    setup,
    useApi,
    useHttp
};

export default {
    setup,
    useApi,
    useHttp
}
