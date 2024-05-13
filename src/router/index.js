import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home' ,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/RotateCube',
    name: 'RotateCube',
    component: () => import('@/pages/threejs/docs-demo/RotateCube.vue'),
    meta: {
      title: 'RotateCube'
    }
  },
  {
    path: '/ThreeCube',
    name: 'ThreeCube',
    component: () => import('@/pages/threejs/docs-demo/ThreeCube.vue'),
    meta: {
      title: 'ThreeCube'
    }
  },
  {
    path: '/DrawingLines',
    name: 'DrawingLines',
    component: () => import('@/pages/threejs/docs-demo/DrawingLines.vue'),
    meta: {
      title: 'DrawingLines'
    }
  },
  {
    path: '/solarSystem',
    name: 'solarSystem',
    component: () => import('@/pages/threejs/docs-demo/solarSystem.vue'),
    meta: {
      title: 'solarSystem'
    }
  },
  {
    path: '/Tank',
    name: 'Tank',
    component: () => import('@/pages/threejs/docs-demo/Tank.vue'),
    meta: {
      title: 'Tank'
    }
  },
  {
    path: '/skinning-and-morphing',
    name: 'skinning-and-morphing',
    component: () => import('@/pages/threejs/example/skinning-and-morphing.vue'),
    meta: {
      title: 'skinning-and-morphing'
    }
  },
  {
    path: '/webgl_animation_keyframes',
    name: 'webgl_animation_keyframes',
    component: () => import('@/pages/threejs/example/webgl_animation_keyframes.vue'),
    meta: {
      title: 'webgl_animation_keyframes'
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.beforeEach(async (to, from, next) => {
  next();
});

export default router;
