import { createRouter, createWebHashHistory  } from 'vue-router'

import Home from '../pages/Home.vue'
import Projects from '../pages/Projects.vue'
import Contact from '../pages/Contact.vue'
import Union from '../pages/Union.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', 
    component: Home,
    name:'home',
    meta:{
      title: '个人主页 - 首页',
      icon: '/Main.jpg'
    }
  },
  { path: '/projects', 
    component: Projects,
    name:'projects',
    meta:{
      title:'我的项目',
      icon: '/Main.jpg'
    }
  },
  { path: '/contact', 
    component: Contact ,
    name:'contact',
    meta:{
      title:'联系作者',
      icon: '/Main.jpg'
    }
  },
  { path: '/union', 
    component: Union,
    name:'union',
    meta:{
      title:'建国大学中国留学生学生会官网',
      icon: 'Union.jpg'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫：每次切换页面后修改标签页标题和图标
router.afterEach((to) => {
  // 修改标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 修改图标：找到或创建 <link rel="icon"> 并修改 href
  if (to.meta.icon) {
    let link = document.querySelector("link[rel='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = to.meta.icon
  }
})

export default router