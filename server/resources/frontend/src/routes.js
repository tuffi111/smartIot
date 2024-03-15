import {isAuth} from '@app/auth'


const routes = [
    {
        path: '/',
        component: () => import("@/views/Home.vue"),
        children: [
            {path: '', component: () => import("@/views/home/Index.vue")},
            {
                path: '/examples',
                component: () => import("@/views/home/Examples.vue"),
                children: [
                    {path: '', component: () => import("@/views/home/examples/Index.vue")},
                ]
            },
            {
                path: '/examples2',
                component: () => import("@/views/home/Examples.vue"),
                children: [
                    {path: '', component: () => import("@/views/home/examples/Index2.vue")},
                ]
            },
            {
                path: '/scenarios',
                component: () => import("@/views/home/Scenarios.vue"),
                children: [
                    {path: '', component: () => import("@/views/home/scenarios/Index.vue")},
                ]
            },
            {
                path: '/devices',
                component: () => import("@/views/home/Devices.vue"),
                children: [
                    {path: '', component: () => import("@/views/home/devices/Index.vue")},
                ],
                meta: {auth: isAuth}
            },

        ],
        meta: {auth: isAuth}
    },

    {path: '/settings', component: () => import("@/views/Settings.vue"), meta: {auth: isAuth}},
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
