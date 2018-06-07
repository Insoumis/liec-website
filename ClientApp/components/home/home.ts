import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

interface InfoLiec {
  title: string;
  context: string;
  image: string;
  sources: string[];
  tags: string[];
  lightTheme: string;
  normalTheme: string;
  darkTheme: string;
}

@Component({
  components: {
    ModalComponent: require("../home-modal/home-modal.vue.html")
  }
})
export default class HomeComponent extends Vue {
  infos: InfoLiec[] = [];

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  mounted() {
    fetch("api/InfoData/InfoLiec")
      .then(response => response.json() as Promise<InfoLiec[]>)
      .then(data => {
        this.infos = data;
      });
    window.addEventListener("scroll", this.handleScroll);
    eventHub.$on("hideTopBar", this.hideTopBar);
    eventHub.$on("showTopBar", this.showTopBar);
  }

  hideTopBar() {
    $(".top-nav").fadeOut();
  }

  showTopBar() {
    $(".top-nav").fadeIn();
  }

  handleScroll() {
    console.log("scrolling...");
    $(window).scroll(function() {
      if ($(window)!.scrollTop() || 0 > 0) {
        eventHub.$emit("hideTopBar");
        $(".scrollToTop").fadeIn();
      } else {
        eventHub.$emit("showTopBar");
        $(".scrollToTop").fadeOut();
      }
    });
  }

  openModal(info: InfoLiec) {
    eventHub.$emit("onOpenModal", info);
  }

  scrollToTop() {
    $(".scrollToTop").fadeOut();
    window.scrollTo(0, 0);
  }
}
