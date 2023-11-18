import {createRouter as vueRouterCreate, createWebHashHistory} from 'vue-router'

export function createRouter(routes, options = {}) {
    return vueRouterCreate(Object.assign({
        history: createWebHashHistory(),
        routes
    }, options))
}


