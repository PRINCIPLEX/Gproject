import Vue from 'vue'
import VueRouter from 'vue-router'



// 路由懒加载
const Login = () => import( /* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import( /* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import( /* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')



const UnBusiness = () => import('../components/UUser/UnBusiness.vue')
const NormalUser = () => import('../components/UUser/NormalUser.vue')
const RecommendUser = () => import('../components/UUser/RecommendUser.vue')


const WarningUser = () => import('../components/IUser/WarningUser.vue')
const INormalUser = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '../components/IUser/INormalUser.vue')

const ScoreEchart = () => import('../components/Echart/ScoreEchart.vue')
const ResultEchart = () => import('../components/Echart/ResultEchart.vue')


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [

      {
        path: '/Welcome',
        component: Welcome
      },
      {
        path: '/unBusiness',
        component: UnBusiness
      },
      {
        path: '/normalUser',
        component: NormalUser
      },
      {
        path: '/recommendUser',
        component: RecommendUser
      },

      {
        path: '/warningUser',
        component: WarningUser
      },
      {
        path: '/iNormalUser',
        component: INormalUser
      },
      {
        path:'/scoreEchart',
        component:ScoreEchart
      },
      {
        path:'/resultEchart',
        component:ResultEchart
      },
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
