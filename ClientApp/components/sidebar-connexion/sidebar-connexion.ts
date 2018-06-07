import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class ConnexionComponent extends Vue {
  isDisplayed: string = "none";

  mounted() {
    eventHub.$on("onOpenConnexion", this.onOpenConnexion);
  }

  onOpenConnexion() {
    this.isDisplayed = "block";
    eventHub.$emit('hideTopBar');
  }

  closeConnexion() {
    this.isDisplayed = "none";
    eventHub.$emit('showTopBar');
  }
}
