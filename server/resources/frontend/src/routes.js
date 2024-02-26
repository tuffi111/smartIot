import userAuth from '@app/auth/user'
import adminAuth from '@app/auth/admin'
import anyAuth from '@app/auth/any'


const routes = [
    {
        path: '/',
        component: () => import("@/views/Home.vue"),
        children: [
            {path: '', component: () => import("@/views/home/Index.vue")},
            {path: '/logout', component: () => import("@/views/Logout.vue")},
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
               meta: {auth: [adminAuth, userAuth]}
            },
            {path: '/settings', component: () => import("@/views/Settings.vue")},
        ],
        meta: {auth: [userAuth]}
    },

    {path: '/register', component: () => import("@/views/Register.vue")},
    {path: '/login', component: () => import("@/views/Login.vue"), meta: {auth: [anyAuth]}},
    //{path: '/login', component: () => import("@/views/Login.vue")},
    {path: '/about', component: () => import("@/views/About.vue")},


    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('@/views/ErrorNotFound.vue')
    }
]

export default routes
