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
  isSearchActive: boolean = false;
  isDraftActive: boolean = false;
  mounted() {
    eventHub.$on("onModalClose", this.hideButtonHover);
  }

  openSearch() {
    eventHub.$emit("onCloseDraft");
    if ($(".search").css("display") == "none") {
      eventHub.$emit("onOpenSearch");      
      eventHub.$emit("openSidePanelBackground");      
      eventHub.$emit('hideTopBar');
      this.isSearchActive = true;
      this.isDraftActive = false;
    } else {
      eventHub.$emit("onCloseSearch");
      eventHub.$emit("closeSidePanelBackground");      
      eventHub.$emit('showTopBar');
      this.isSearchActive = false;
    }
  }

  openConnexion() {
    eventHub.$emit("onCloseSearch");
    if ($(".draft").css("display") == "none") {
      eventHub.$emit("openDraft");      
      eventHub.$emit("openSidePanelBackground");      
      eventHub.$emit('hideTopBar');
      this.isDraftActive = true;
      this.isSearchActive = false;
    } else {
      eventHub.$emit("onCloseDraft");
      eventHub.$emit("closeSidePanelBackground");
      eventHub.$emit('showTopBar');
      this.isDraftActive = false;
    }
  }

  openSocialNetwork()
  {
    eventHub.$emit("closeDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");    
    eventHub.$emit('hideTopBar');
  }

  hideButtonHover(){
    this.isDraftActive = false;
    this.isSearchActive = false;
  }
}
