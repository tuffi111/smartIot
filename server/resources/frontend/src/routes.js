import {isAuth} from '@app/auth'


const routes = [
    {
        path: '/',
        component: () => import("@/views/Home.vue"),
        children: [
            {path: '', component: () => import("@/views/home/Index.vue")},
            {path: '/examples', component: () => import("@/views/home/Examples.vue")},
            {
                path: '/scenarios',
                component: () => import("@/views/Scenarios.vue"),
                children: [
                    {path: '', component: () => import("@/views/scenarios/Index.vue")},
                ]
            },
            {
                path: '/devices',
                component: () => import("@/views/Devices.vue"),
                children: [
                    {path: '', component: () => import("@/views/devices/Index.vue")},
                ],
               meta: {auth: isAuth}
            },
            {path: '/settings', component: () => import("@/views/Settings.vue")},
        ],
        meta: {auth: isAuth}
    },

    {path: '/register', component: () => import("@/views/Register.vue")},
    {path: '/login', component: () => import("@/views/Login.vue")},
    {path: '/about', component: () => import("@/views/About.vue")},


    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('@/views/ErrorNotFound.vue')
    }
]

export default routes
