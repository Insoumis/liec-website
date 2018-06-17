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
  creationDate: string;
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
    window.addEventListener("scroll", this.handleScroll);
    eventHub.$on("hideTopBar", this.onHideTopBar);
    eventHub.$on("updateInfo", this.onUpdateInfo);
    eventHub.$on("showTopBar", this.onShowTopBar);
    eventHub.$on("openSidePanelBackground", this.onOpenSidePanelBackground);
    eventHub.$on("closeSidePanelBackground", this.onCloseSidePanelBackground);
    eventHub.$emit("updateInfo");
  }

  onUpdateInfo(infos: InfoLiec[]) {
    console.log(infos);
    if (infos === undefined) {
      fetch("api/InfoData/InfoLiec")
        .then(response => response.json() as Promise<InfoLiec[]>)
        .then(datas => {
          datas.forEach(data => {
            data.creationDate = data.creationDate.substring(0,10);
          });
          this.infos = datas;
        });
    }
    else{
      this.infos = infos;
    }
  }

  onHideTopBar() {
    if ($(".top-nav").css("display") == "block") {
    $(".top-nav").fadeOut();
    }
  }

  onShowTopBar() {
    if ($(".top-nav").css("display") == "none") {
    $(".top-nav").fadeIn();
    }
  }

  handleScroll() {
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
    eventHub.$emit("onModalClose")
    this.onCloseSidePanelBackground();
  }
}
