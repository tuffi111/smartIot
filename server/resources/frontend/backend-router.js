import route from 'ziggy';
import {inject} from 'vue';

const injectionKeyRouteResolver = Symbol('resolveRoute');

let routeResolver
let resolveRouteInjected = false;

export default (ziggy = {}) => {
    routeResolver = (name, params = '', absolute = true, config = ziggy) => {

        if (name in ziggy.routes) {
            return Object.assign({}, ziggy.routes[name], {
                uri: route(name, params, absolute, config)
            })
        }

        throw new Error(`Unknown route "${name}"`)
    }

    return {
        install(app) {
            app.provide(injectionKeyRouteResolver, routeResolver);
            app.config.globalProperties.resolveRoute = routeResolver;
        },
    };
};

export const resolveRoute = (...args) => {
    if (!resolveRouteInjected) {
        inject(injectionKeyRouteResolver);
        resolveRouteInjected = true;
    }
    return routeResolver(...args);
};
