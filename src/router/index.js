import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '../views/layout/Layout'
//所有权限通用路由表 
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/register/register'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '账户管理', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '角色管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/equipment',
    component: Layout,
    children: [
      {
        path: 'equipment',
        name: 'Form',
        component: () => import('@/views/table/equipment'),
        meta: { title: '设备管理', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    alwaysShow: true,//是否始终显示跟菜单
    meta: { role: ['admin', 'editor'], title: '权限测试页' }, //页面需要的权限
    children: [
      {
        path: 'admin',
        component: () => import('@/views/permission/admin'),
        name: '权限测试页1',
        meta: { role: ['admin'], title: 'admin显示' }  //页面需要的权限
      },
      {
        path: 'editor',
        component: () => import('@/views/permission/admin'),
        name: '权限测试页2',
        meta: { role: ['admin'], title: 'editor显示' }  //页面需要的权限
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
//实例化vue的时候只挂载constantRouter
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

