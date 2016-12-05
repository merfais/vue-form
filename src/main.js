import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter();
router.map({
  '/form': {
    component(resolve) {
      require(['./views/FormTest.vue'], resolve);
    }
  },
  '/test': {
    component(resolve) {
      require(['./views/test.vue'], resolve);
    }
  },
});

router.start(App, '#app');

