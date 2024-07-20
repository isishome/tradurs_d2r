import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:lang([^/]{2})?',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        name: 'add',
        path: 'add/:id([0-9]{1,})?',
        component: () => import('pages/AddPage.vue'),
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
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
