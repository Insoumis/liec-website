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
    eventHub.$emit("closeDraft");
    if ($(".search").css("display") == "none") {
      eventHub.$emit("onOpenSearch");      
      eventHub.$emit("openSidePanelBackground");      
      eventHub.$emit('hideTopBar');
    } else {
      eventHub.$emit("onCloseSearch");
      eventHub.$emit("closeSidePanelBackground");      
      eventHub.$emit('showTopBar');
    }
    if ($(".side-panel-background").css("display") == "none") {
    }
  }

  openConnexion() {
    eventHub.$emit("onCloseSearch");
    if ($(".draft").css("display") == "none") {
      eventHub.$emit("openDraft");      
      eventHub.$emit("openSidePanelBackground");      
      eventHub.$emit('hideTopBar');
    } else {
      eventHub.$emit("closeDraft");
      eventHub.$emit("closeSidePanelBackground");
      eventHub.$emit('showTopBar');
    }
    if ($(".side-panel-background").css("display") == "none") {
      
    }
  }

  openSocialNetwork()
  {
    eventHub.$emit("closeDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");    
    eventHub.$emit('hideTopBar');
  }
}
