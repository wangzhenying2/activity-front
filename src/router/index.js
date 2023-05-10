import 'libs/axdApp.js'
import { createRouter, createWebHistory } from 'vue-router'

import { isAndroid, isApp, newerVersionThan, isIOS } from 'libs/utils'

const Layout = () => import('src/views/Layout.vue')
const draw = () => import('src/views/draw/index.vue')

const NotFound = () => import('src/views/common/404.vue')



const routes = [
    {
        path: '/pages',
        component: Layout,
        children: [
            {
                path: 'draw',
                name: 'draw',
                component: draw,
                meta: {
                    title: '抽奖'
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        name: 'notfound',
        meta: {
            title: '404'
        }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (isApp) {
        if (to.path === '/pages/homePage' && (isIOS || (isAndroid && !newerVersionThan('2.0.0')))) {
            window.axdApp.send({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: true
                }
            })
        } else {
            window.axdApp.send({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: false
                }
            })
        }
        window.axdApp.send({
            module: 'webview',
            method: 'setRightCloseBtnStatus',
            params: {
                showClose: false
            }
        })
    }

    next()
})

router.afterEach((to, from) => {

})
