import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {
        MenuComponent: require('../sidebar/sidebar.vue.html'),
        TopbarComponent: require('../topbar/topbar.vue.html')
    }
})
export default class AppComponent extends Vue {
}
