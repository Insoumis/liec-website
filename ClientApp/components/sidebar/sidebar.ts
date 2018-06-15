import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component({
  components: {
    SearchComponent: require("../sidebar-search/sidebar-search.vue.html"),
    DraftComponent: require("../sidebar-draft/sidebar-draft.vue.html"),
    ConnexionComponent: require("../sidebar-connexion/sidebar-connexion.vue.html")
  }
})
export default class SidebarComponent extends Vue {
  mounted() {}

  openSearch() {
    if ($(".search").css("display") == "none") {
      eventHub.$emit("onOpenSearch");
    } else {
      eventHub.$emit("onCloseSearch");
    }
  }

  openConnexion() {
    eventHub.$emit("openDraft");
  }
}
