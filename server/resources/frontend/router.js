import {createRouter as vueRouterCreate, createWebHashHistory} from 'vue-router'
import {canAccess} from "@/auth.js";

export function createRouter(routes, options = {}) {
    let router = vueRouterCreate(Object.assign({
        history: createWebHashHistory(),
        routes
    }, options));

    router.beforeEach(async (to) => {

        const {auth} = to.meta;
        if (auth) {
            if (await canAccess(auth)) {
                console.info('AUTH: ROUTE ACCESS GRANTED')
                if (to.path === '/login') {
                    return '/';
                }
            }else{
                console.warn('AUTH: ROUTE ACCESS DENIED')
                if (to.path !== '/login') {
                    return '/login';
                }
            }
        }
    })

    return router;
}

