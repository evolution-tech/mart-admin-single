import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'el-icon-s-home' }
      }
    ]
  },
  {
    path: '/me',
    component: Layout,
    redirect: '/me/profile',
    hidden: true,
    children: [
      {
        path: 'profile',
        component: () => import('@/views/me/profile/index'),
        name: 'Profile',
      },
      {
        path: 'notification',
        component: () => import('@/views/me/notification/index'),
        name: 'Notification',
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/employee-mgr',
    component: Layout,
    redirect: '/employee-mgr/employee',
    alwaysShow: true,
    name: 'EmployeeMgr',
    meta: {
      title: '员工管理',
      icon: 'el-icon-user-solid',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'employee',
        component: () => import('@/views/employee-mgr/employee/index'),
        name: 'Employee',
        meta: {
          title: '员工',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/employee-mgr/role/index'),
        name: 'Role',
        meta: {
          title: '角色',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/shop-mgr',
    component: Layout,
    redirect: '/shop-mgr/profile',
    alwaysShow: true,
    name: 'ShopMgr',
    meta: {
      title: '店铺管理',
      icon: 'el-icon-s-shop',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/shop-mgr/profile/index'),
        name: 'ShopProfile',
        meta: {
          title: '店铺资料',
          roles: ['admin']
        }
      },
      {
        path: 'decoration',
        component: () => import('@/views/shop-mgr/decoration/index'),
        name: 'Decoration',
        meta: {
          title: '店铺装修',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/item-mgr',
    component: Layout,
    redirect: '/item-mgr/item',
    alwaysShow: true,
    name: 'ItemMgr',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-goods',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'item',
        component: () => import('@/views/item-mgr/item/index'),
        name: 'Item',
        meta: {
          title: '商品',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/customer-mgr',
    component: Layout,
    redirect: '/customer-mgr/customer',
    alwaysShow: true,
    name: 'CustomerMgr',
    meta: {
      title: '顾客管理',
      icon: 'el-icon-s-custom',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'customer',
        component: () => import('@/views/customer-mgr/customer/index'),
        name: 'Customer',
        meta: {
          title: '顾客',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/order-mgr',
    component: Layout,
    redirect: '/order-mgr/order',
    alwaysShow: true,
    name: 'OrderMgr',
    meta: {
      title: '订单管理',
      icon: 'el-icon-s-order',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order-mgr/order/index'),
        name: 'Order',
        meta: {
          title: '订单',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: '错误日志', icon: 'el-icon-warning' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
