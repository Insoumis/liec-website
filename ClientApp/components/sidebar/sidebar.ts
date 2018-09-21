import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component({
  components: {
    SearchComponent: require("../sidebar-search/sidebar-search.vue.html"),
    DraftComponent: require("../sidebar-draft/sidebar-draft.vue.html"),
  }
})
export default class SidebarComponent extends Vue {
  isSearchActive: boolean = false;
  isDraftActive: boolean = false;
  isAboutActive: boolean = false;
  isRssActive: boolean = false;
  mounted() {
    eventHub.$on("onModalClose", this.hideButtonHover);
    eventHub.$on("onCloseToggle", this.closeToggle);
    
    eventHub.$on("openSidePanelBackground", this.onOpenSidePanelBackground);
    eventHub.$on("closeSidePanelBackground", this.onCloseSidePanelBackground);
  }

  closeToggle() {
    var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    if (width <= 768) {
      $(".navbar-toggle").click();
    }
  }

  toggleSidePanelBackground(){
    if ($(".search").css("display") == "none" || $(".sidebar-draft").css("display") == "none")
     {      
      eventHub.$emit("openSidePanelBackground");      
      eventHub.$emit("hideTopBar");
    }
    else {      
      eventHub.$emit("closeSidePanelBackground");      
      eventHub.$emit("showTopBar");
    }
  }

  openSearch() {
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseToggle");
    if ($(".search").css("display") == "none") {
      eventHub.$emit("onOpenSearch");
      this.isSearchActive = true;
      this.isDraftActive = false;
      this.isAboutActive = false;
      this.isRssActive = false;
    } else {
      eventHub.$emit("onCloseSearch");
      this.isSearchActive = false;
    }
  }

  openConnexion() {
    eventHub.$emit("onCloseToggle");
    eventHub.$emit("onCloseSearch");
    if ($(".sidebar-draft").css("display") == "none") {
      eventHub.$emit("openDraft");
      this.isDraftActive = true;
      this.isSearchActive = false;
      this.isAboutActive = false;
      this.isRssActive = false;
    } else {
      eventHub.$emit("onCloseDraft");
      this.isDraftActive = false;
    }
  }

  openAbout() {
    eventHub.$emit("onCloseToggle");
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");
    eventHub.$emit("showTopBar");
    this.isDraftActive = false;
    this.isSearchActive = false;
    this.isAboutActive = true;
    this.isRssActive = false;
  }

  openRss() {
    eventHub.$emit("onCloseToggle");
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");
    eventHub.$emit("hideTopBar");
    this.isDraftActive = false;
    this.isSearchActive = false;
    this.isAboutActive = false;
    this.isRssActive = true;
  }

  openSocialNetwork() {
    eventHub.$emit("onCloseToggle");
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("closeSidePanelBackground");
    eventHub.$emit("hideTopBar");
  }

  hideButtonHover() {
    this.isDraftActive = false;
    this.isSearchActive = false;
  }

  onOpenSidePanelBackground() {
    //console.log("Switching background..." + $(".side-panel-background").css("display"));
    if ($(".side-panel-background").css("display") == "none") {
      $(".side-panel-background").fadeIn();
    }
  }

  onCloseSidePanelBackground() {
    //console.log("Switching background..." + $(".side-panel-background").css("display"));
    if ($(".side-panel-background").css("display") == "block") {
      $(".side-panel-background").fadeOut();
    }
  }

  closePanel() {
    eventHub.$emit("onCloseSearch");
    eventHub.$emit("onCloseDraft");
    eventHub.$emit("onModalClose");
    this.onCloseSidePanelBackground();         
    eventHub.$emit("showTopBar");
  }

}
