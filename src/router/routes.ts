import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:lang([^/]{2})?',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'main',
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        name: 'add',
        path: 'add/:id([0-9]{1,})?',
        component: () => import('pages/AddPage.vue'),
        meta: {
          requireAuth: true
        },
        props: true
      },
      {
        name: 'clone',
        path: 'clone/:id([0-9]{1,})',
        component: () => import('pages/AddPage.vue'),
        meta: {
          requireAuth: true
        },
        props: true
      },
      {
        name: 'item',
        path: 'item/:id([0-9]{1,})',
        component: () => import('pages/ItemPage.vue'),
        props: true
      },
      {
        name: 'help',
        path: 'help/:category([a-z]{1,})?',
        component: () => import('pages/HelpPage.vue'),
        props: true
      },
      {
        name: 'test',
        path: 'test',
        component: () => import('pages/TestPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    name: 'pnf',
    path: '/:catchAll(.*)*',
    component: () => import('pages/PageNotFound.vue')
  },
  {
    name: 'ftc',
    path: '/:catchAll(.*)*',
    component: () => import('pages/FailedToConnection.vue')
  }
]

export default routes
