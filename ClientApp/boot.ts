import './css/site.css';
import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
    { path: '/', component: require('./components/home/home.vue.html') },
    { path: '/about', component: require('./components/about/about.vue.html') },
    { path: '/rss', component: require('./components/rss/rss.vue.html') },
    { path: '/generate', component: require('./components/generate/generate.vue.html') },
    { path: '/draft', component: require('./components/draft/draft.vue.html') },
];

new Vue({
    el: '#app-root',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: h => h(require('./components/app/app.vue.html'))
});
