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
  isAboutActive: boolean = false;
  isRssActive: boolean = false;
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
      this.isAboutActive = false;
      this.isRssActive = false;
    } else {
      eventHub.$emit("onCloseSearch");
      eventHub.$emit("closeSidePanelBackground");      
      eventHub.$emit('showTopBar');
      this.isSearchActive = false;
    }
  }

  openConnexion() {
    eventHub.$emit("onCloseSearch");
    if ($(".sidebar-draft").css("display") == "none") {
      eventHub.$emit("openDraft");      
      eventHub.$emit("openSidePanelBackground");      
      eventHub.$emit('hideTopBar');
      this.isDraftActive = true;
      this.isSearchActive = false;
      this.isAboutActive = false;
      this.isRssActive = false;
    } else {
      eventHub.$emit("onCloseDraft");
      eventHub.$emit("closeSidePanelBackground");
      eventHub.$emit('showTopBar');
      this.isDraftActive = false;
    }
  }

  openAbout(){    
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");     
    eventHub.$emit('showTopBar');
    this.isDraftActive = false;
    this.isSearchActive = false;
    this.isAboutActive = true;
    this.isRssActive = false;
  }

  openRss(){    
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");     
    eventHub.$emit('hideTopBar');
    this.isDraftActive = false;
    this.isSearchActive = false;
    this.isAboutActive = false;
    this.isRssActive = true;
  }

  openSocialNetwork()
  {
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");    
    eventHub.$emit('hideTopBar');
  }

  hideButtonHover(){
    this.isDraftActive = false;
    this.isSearchActive = false;
  }
}
