import Vue from 'vue'
// import App from './App'
// import Index from './Index'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
// import vegetablesclass from './components/vegetablesclass'
// import plantingbox from './components/plantingbox'

import Weixin from './Weixin'
import XSDK from './xLinkSDK'
///

import 'mint-ui/lib/style.css'
import MintUI from 'mint-ui'
import {Indicator, Toast} from 'mint-ui'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(MintUI)
/* eslint-disable no-new */


Weixin.init()
XSDK()

let router = new VueRouter({
  //mode: 'history',
  routes: [
    {path: '/', redirect: '/index'},
    {path: '/index', component: resolve => require(['./Index'], resolve)},
    {
      path: '/control/', component: resolve => require(['./App'], resolve),
      children: [
        {path: 'vegetablesclass/:deviceId', component: resolve => require(['./components/vegetablesclass'], resolve)},
        {path: 'plantingbox/:deviceId', component: resolve => require(['./components/plantingbox'], resolve)}
      ]
    }
  ]
})

router.afterEach(route => {
  Indicator.close();
})

window.router = router;


new Vue({
  el: '#app',
  router

})


