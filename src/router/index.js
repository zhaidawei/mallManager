import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';

import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/rights.vue'
import Roles from '@/components/rights/roles.vue'
Vue.use(Router)

const router =  new Router({
	routes: [
	{
		name: 'login',
		path: '/login',
		component: Login
	},
	{
		name: 'home',
		path: '/',
		component: Home,
		children: [
			{
				name: 'users',
				path: '/users',
				component: Users			
			},
			{
				name: 'rights',
				path: '/rights',
				component: Rights			
			},
			{
				name: 'roles',
				path: '/roles',
				component: Roles			
			},
		]
	},
	]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
  	next()
  } else {
  	const token = localStorage.getItem('token')
    if (!token) {
    	Massege.warning("请先登录")
      router.push({name:'login'})
      return
    }
  	next()    
  }
})

export default router
