import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class SearchComponent extends Vue {
  isDisplayed: string = "none";
  imageRed = "../../../wwwroot/content/logo-vert-1.png";

  mounted() {
    eventHub.$on("onOpenSearch", this.onOpenSearch);
    eventHub.$on("onCloseSearch", this.closeSearch);
    $(".theme").on("click", function(e){
      $(this).toggleClass( "active", !$(this).hasClass("active") );
  });
  }

  onOpenSearch() {      
    this.isDisplayed = "block";    
    eventHub.$emit('hideTopBar');
    eventHub.$emit("switchSidePanelBackground");
  }

  closeSearch() {
    this.isDisplayed = "none";    
    eventHub.$emit('showTopBar');
    eventHub.$emit("switchSidePanelBackground");
  }
}
