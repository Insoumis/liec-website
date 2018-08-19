import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class GenerateComponent extends Vue {
  isOk: boolean = false;

  mounted() {
  }

  handleSubmit(e: Event) {
    e.preventDefault();
      var baseUri = "/api/InfoData/GenerateInfoLiec";

    console.log("generate");

    fetch(baseUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response =>  {
          this.isOk = response.ok;
      });
  }
}
