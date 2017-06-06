import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

function loadPage(page) {
  return () => System.import(`./pages/${page}.vue`);
}

function loadComponent(component) {
  return () => System.import(`./components/${component}.vue`);
}

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) return savedPosition;
  const position = {};
  if (to.hash) {
    position.selector = to.hash;
  }
  if (to.matched.some(m => m.meta.scrollToTop)) {
    position.x = 0;
    position.y = 0;
  }
  if (to.name !== 'chat') {
    position.x = 0;
    position.y = 0;
  }
  return position;
};

export default new VueRouter({
  mode: 'history',
  scrollBehavior,
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'index',
      components: {
        default: loadPage('Index'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/index',
      name: 'index2',
      redirect: '/',
    },
    {
      path: '/profile',
      name: 'profile',
      components: {
        default: loadPage('Profile'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/settings',
      name: 'settings',
      components: {
        default: loadPage('Settings'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
      },
    },
    {
      path: '/terms',
      name: 'terms',
      components: {
        default: loadPage('Terms'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/add',
      name: 'add',
      components: {
        default: loadPage('Add'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/chat',
      name: 'chat',
      components: {
        default: loadPage('Chat'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        chatInput: loadComponent('ChatInput'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/comments/:commentId',
      name: 'comments',
      components: {
        default: loadPage('Comment'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        chatInput: loadComponent('ChatInput'),
        footer: loadComponent('Footer'),
      },
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      components: {
        default: loadPage('Login'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/register',
      name: 'register',
      components: {
        default: loadPage('Register'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/recover',
      name: 'recover',
      components: {
        default: loadPage('Recover'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '*',
      name: 'error',
      components: {
        default: loadPage('Error'),
        footer: loadComponent('Footer'),
      },
    },
  ],
});
