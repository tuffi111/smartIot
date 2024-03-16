import route from 'ziggy';
import {inject} from 'vue';

const injectionKeyApiRoute = Symbol('apiRoute');
const injectionKeyRouteResolver = Symbol('resolveRoute');

let routeResolver
let apiRouter
let apiRouteInjected = false;
let resolveRouteInjected = false;

export default (ziggy = {}) => {
    routeResolver = (name, params = '', absolute = true, config = ziggy) => {
        return route(name, params, absolute, config);
    }

    apiRouter = (name, config = ziggy) => {
        if (name in ziggy.routes) {
            return Object.assign({name: name}, ziggy.routes[name])
        }
        throw new Error(`Unknown route "${name}"`)
    }

    return {
        install(app) {
            app.provide(injectionKeyApiRoute, apiRouter);
            app.config.globalProperties.apiRoute = apiRouter;
            app.provide(injectionKeyRouteResolver, routeResolver);
            app.config.globalProperties.resolveRoute = routeResolver;
        },
    };
};

export const apiRoute = (...args) => {
    if (!apiRouteInjected) {
        inject(injectionKeyApiRoute);
        apiRouteInjected = true;
    }
    return apiRouter(...args);
};
export const resolveRoute = (...args) => {
    if (!resolveRouteInjected) {
        inject(injectionKeyRouteResolver);
        resolveRouteInjected = true;
    }
    return routeResolver(...args);
};
