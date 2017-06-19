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
  return false;
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
      path: '/profile/:userName',
      name: 'profile2',
      components: {
        default: loadPage('Profile'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        footer: loadComponent('Footer'),
      },
      props: {
        default: true,
        sideBar: false,
        toolBar: false,
      },
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
      path: '/help',
      name: 'help',
      components: {
        default: loadPage('Help'),
        sideBar: loadComponent('Sidebar'),
        toolBar: loadComponent('Toolbar'),
        footer: loadComponent('Footer'),
      },
    },
    {
      path: '/create',
      name: 'create',
      components: {
        default: loadPage('Create'),
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
      },
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
