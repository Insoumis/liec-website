import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {
        MenuComponent: require('../navmenu/navmenu.vue.html'),
        TopbarComponent: require('../topbar/topbar.vue.html')
    }
})
export default class AppComponent extends Vue {
}
