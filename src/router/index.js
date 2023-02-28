import Vue from 'vue'
import Router from 'vue-router'
import { Layout, Content } from '../layout' // 页面整体布局
import { topRouterMap } from './topRouter'

process.env.NODE_ENV === 'development' ? Vue.use(Router) : null

function filterTopRouterMap(name) {
  let router = topRouterMap.find((item) => {
    return item.parentName === name
  })
  return router.data // arr
}

/**
 * 1、roles:后台返回的权限结构;
 *
 */
//手动跳转的页面白名单
const whiteList = ['/']
/**
 * path:''与path:'*'的区别：
 * 1、path:'*', 会匹配所有路径
 * 2、path:''，也是会匹配到路由
 *
 */
//默认不需要权限的页面
export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/index/index',
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/login'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/page/errorPage/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/page/errorPage/401'),
    hidden: true,
  },
  {
    path: '/index',
    name: 'index',
    component: Layout,
    meta: {
      title: '游戏配置',
      icon: 'icondashboard',
    },
    noDropdown: true,
    children: [
      {
        path: 'index',
        meta: {
          title: '游戏配置',
          icon: 'icondashboard',
          routerType: 'admin',
        },
        component: () => import('@/page/index/index'),
      },
    ],
  },
  {
    path: '/fundManage',
    name: 'fundManage',
    meta: {
      title: '系统管理',
      icon: 'iconpay3',
    },
    component: Layout,
    children: [
      {
        path: 'fundList',
        name: 'fundList',
        meta: {
          title: '游戏配置',
          routerType: 'admin',
        },
        component: () => import('@/page/fundList/fundList'),
      },
      {
        path: 'classify',
        name: 'classify',
        meta: {
          title: '分类配置',
          routerType: 'admin',
        },
        component: () => import('@/page/fundList/classify'),
      },
      {
        path: 'domain',
        name: 'domain',
        meta: {
          title: '域名配置',
          routerType: 'admin',
        },
        component: () => import('@/page/fundList/domain'),
      },
    ],
  },
  // {
  //   path: '/permission',
  //   name: 'permission',
  //   meta: {
  //     title: '权限设置',
  //     icon: 'iconpermission',
  //     roles: ['admin', 'editor'], // you can set roles in root nav
  //   },
  //   component: Layout,
  //   redirect: '/permission/page',
  //   children: [
  //     {
  //       path: 'page',
  //       name: 'pagePer',
  //       meta: {
  //         title: '页面权限',
  //         roles: ['admin'], // or you can only set roles in sub nav
  //       },
  //       component: () => import('@/page/permission/page'),
  //     },
  //     {
  //       path: 'directive',
  //       name: 'directivePer',
  //       meta: {
  //         title: '按钮权限',
  //         roles: ['admin'],
  //       },
  //       component: () => import('@/page/permission/directive'),
  //     },
  //   ],
  // },
]

//注册路由
export default new Router({
  mode: 'history', // 默认为'hash'模式
  base: '/appraisal/', // 添加跟目录,对应服务器部署子目录
  routes: constantRouterMap,
})

//异步路由（需要权限的页面）
export const asyncRouterMap = [
  // {
  // 	path:'/share',
  // 	name: 'share',
  // 	component:Layout,
  // 	meta: {
  // 		title:'分享功能',
  // 		icon: 'iconshare',
  // 	},
  // 	noDropdown:true,
  // 	children:[
  // 		{
  // 			path:'share',
  // 			meta:{
  // 			  title:'分享功能',
  // 			  icon:'iconshare',
  // 			  routerType:'leftmenu'
  // 			},
  // 			component: () => import('@/page/share'),
  // 		}
  // 	]
  // },

  // {
  //   path: '/fundData',
  //   name: 'fundData',
  //   meta: {
  //     title: '资金数据',
  //     icon: 'iconecharts',
  //   },
  //   component: Layout,
  //   redirect: '/fundData/fundPosition',
  //   children: [
  //     {
  //       path: 'fundPosition',
  //       name: 'fundPosition',
  //       meta: {
  //         title: '投资分布',
  //       },
  //       component: () => import('@/page/fundData/fundPosition'),
  //     },
  //     {
  //       path: 'typePosition',
  //       name: 'typePosition',
  //       meta: {
  //         title: '项目分布',
  //       },
  //       component: () => import('@/page/fundData/typePosition'),
  //     },
  //     {
  //       path: 'incomePayPosition',
  //       name: 'incomePayPosition',
  //       meta: {
  //         title: '收支统计',
  //       },
  //       component: () => import('@/page/fundData/incomePayPosition'),
  //     },
  //   ],
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   name: 'errorPage',
  //   meta: {
  //     title: '错误页面',
  //     icon: 'iconError',
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       name: 'page401',
  //       component: () => import('@/page/errorPage/401'),
  //       meta: {
  //         title: '401',
  //         noCache: true,
  //       },
  //     },
  //     {
  //       path: '404',
  //       name: 'page404',
  //       component: () => import('@/page/errorPage/404'),
  //       meta: {
  //         title: '404',
  //         noCache: true,
  //       },
  //     },
  //   ],
  // },
  { path: '*', redirect: '/404', hidden: true },
]
