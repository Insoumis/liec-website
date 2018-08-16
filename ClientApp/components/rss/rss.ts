import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class RssComponent extends Vue {
  errors: string[] = [];  
  feed: string = "";

  mounted() {
    eventHub.$on("updateFeed", this.onUpdateFeed);   
    eventHub.$emit("updateFeed");
  }

  onUpdateFeed(feed: string){
    if (feed === undefined) {      
      fetch("api/Rss/Feed")
        .then(response => response.json() as Promise<string>)
        .then(datas => {
          console.log(datas);
          this.feed = datas;
        });
    } else {
      this.feed = feed;
    }
  }
}
