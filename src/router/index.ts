import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const APP_NAME = 'Purple Cross · Employee Management'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'employee-list' },
  },
  {
    path: '/employees',
    name: 'employee-list',
    component: () => import('@/views/EmployeeListView.vue'),
    meta: { title: 'Employees' },
  },
  {
    path: '/employees/:code',
    name: 'employee-profile',
    component: () => import('@/views/EmployeeProfileView.vue'),
    props: true,
    meta: { title: 'Employee profile' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Not found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? ''
  document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
})

export default router
