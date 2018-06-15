import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class SearchComponent extends Vue {
  isDisplayed: string = "none";
  errors: string[] = [];

  mounted() {
    eventHub.$on("openDraft", this.onOpenDraft);
    eventHub.$on("closeDraft", this.onCloseDraft);
  }

  onOpenDraft() {
    this.isDisplayed = "block";
    eventHub.$emit("hideTopBar");
    eventHub.$emit("switchSidePanelBackground");
  }

  onCloseDraft() {
    this.isDisplayed = "none";
    eventHub.$emit("showTopBar");
    eventHub.$emit("switchSidePanelBackground");
  }

  connectOrSubscribe() {
    eventHub.$emit("onOpenConnexion");
  }
}
