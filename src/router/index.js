import Vue from 'vue'
import VueRouter from 'vue-router'



// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')
const Business = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Business.vue')
const Customer = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Customer.vue')
const Category = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/goods/Category.vue')
const Goods = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/goods/Goods.vue')
const AddGoods = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/goods/AddGoods.vue')
const EditGoods = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/goods/EditGoods.vue')
const Order = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/order/Order.vue')
const DealOrder = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/order/DealOrder.vue')




Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      { path: '/order', component: Order },
      { path: '/dealorder', component: DealOrder },
      { path: '/Welcome', component: Welcome },
      { path: '/business', component: Business },
      { path: '/customer', component: Customer },
      { path: '/category', component: Category },
      { path: '/goods', component: Goods },
      { path: '/addgoods', component: AddGoods },
      { path: '/editgoods', component: EditGoods },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
