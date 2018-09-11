import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class TopBarComponent extends Vue {
  mounted() {
    eventHub.$on("hideTopBar", this.onHideTopBar);
    eventHub.$on("showTopBar", this.onShowTopBar);
  }

  onHideTopBar() {
    if ($(".top-nav").css("display") != "none") {
      $(".top-nav").fadeOut();
    }
  }

  onShowTopBar() {
    if ($(".top-nav").css("display") == "none") {
      $(".top-nav").fadeIn();
    }
  }
}
