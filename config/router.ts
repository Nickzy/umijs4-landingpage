
export default [
    {
        path: '/',
        component: '@/layouts/index',
        routes: [
            { path: '/', component: '@/pages/index' },
        ]
    },
    {
        path: '/index',
        name: 'index',
        icon: 'fund',
        component: '@/pages/index',
    },
    {
        path: '/demo',
        name: 'demo',
        icon: 'copy',
        component: '@/pages/DEMO',
    }
]