import Vue from 'vue'
import Router from 'vue-router'
import Index from 'components/Index'
import Send from 'components/Auth/Send'
import User from 'components/Auth/Member'
import Login from 'components/Auth/Login'
import Email from 'components/Auth/Email'
import Register from 'components/Auth/Register'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },{
      path: "/login",
      name: "Login",
      component: Login
    },{
      path: "/register",
      name: "Register",
      component: Register
    },{
      path: "/user",
      name: "User",
      component: User
    },{
      path: "/email",
      name: "Email",
      component: Email
    },{
      path: "/send",
      name: "Send",
      component: Send
    }
  ]
})
