import {isAuth} from '@/auth'


const routes = [{
    path: '/',
    component: () => import("@app/views/Home.vue"),
    children: [
        {path: '', component: () => import("@app/views/home/Index.vue")},
        {
            path: '/examples',
            component: () => import("@app/views/home/Examples.vue"),
            children: [
                {path: '', component: () => import("@app/views/home/examples/Index.vue")},
            ]
        }, {
            path: '/scenarios',
            component: () => import("@app/views/home/Scenarios.vue"),
            children: [
                {path: '', component: () => import("@app/views/home/scenarios/Index.vue")},
            ]
        }, {
            path: '/devices',
            component: () => import("@app/views/home/Devices.vue"),
            children: [
                {path: '', component: () => import("@app/views/home/devices/Index.vue")},
            ],
            meta: {auth: isAuth}
        },
    ],
    meta: {auth: isAuth}
},
    {path: '/settings', component: () => import("@app/views/Settings.vue"), meta: {auth: isAuth}},
    {path: '/register', component: () => import("@app/views/Register.vue")},
    {path: '/login', component: () => import("@app/views/Login.vue")},
    {path: '/about', component: () => import("@app/views/About.vue")},


    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('@app/views/ErrorNotFound.vue')
    }
]

export default routes
