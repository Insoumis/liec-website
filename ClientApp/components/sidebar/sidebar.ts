import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from '../eventhub/eventhub'

@Component({
    components: {
        SearchComponent: require('../sidebar-search/sidebar-search.vue.html'),
        ConnexionComponent: require('../sidebar-connexion/sidebar-connexion.vue.html'),
    }
})

export default class SidebarComponent extends Vue {

    mounted() {       
      }
    
      openSearch(){          
          eventHub.$emit('onOpenSearch');
      }

      openConnexion(){          
          eventHub.$emit('onOpenConnexion');
      }
}
