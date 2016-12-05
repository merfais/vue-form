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
});

router.start(App, '#app');

