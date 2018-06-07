import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class SearchComponent extends Vue {
  isDisplayed: string = "none";

  mounted() {
    eventHub.$on("onOpenSearch", this.onOpenSearch);
    eventHub.$on("onCloseSearch", this.closeSearch);
  }

  onOpenSearch() {      
    this.isDisplayed = "block";    
    eventHub.$emit('hideTopBar');
  }

  closeSearch() {
    this.isDisplayed = "none";    
    eventHub.$emit('showTopBar');
  }
}
