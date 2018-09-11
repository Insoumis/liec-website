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
  isFecthing: boolean = false;

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  mounted() {
    window.onscroll = this.handleScroll;
    eventHub.$on("updateInfo", this.onUpdateInfo);
    eventHub.$on("openSidePanelBackground", this.onOpenSidePanelBackground);
    eventHub.$on("closeSidePanelBackground", this.onCloseSidePanelBackground);
    eventHub.$emit("updateInfo");
  }

  sourceShortener(src: string) {
    var result = "";
    var srcArray = src
      .replace("http://", "")
      .replace("https://", "")
      .replace("www", "")
      .split("/");
      
    if (srcArray.length > 1) result = srcArray[0];
    else result = src;

    return result;
  }

  onUpdateInfo(infos: InfoLiec[]) {
    console.log(infos);
    if (infos === undefined) {
      fetch("api/InfoData/InfoLiec")
        .then(response => response.json() as Promise<InfoLiec[]>)
        .then(datas => {
          datas.forEach(data => {
            data.creationDate = data.creationDate.substring(0, 10);
          });
          this.infos = datas;
          $(".loader").hide();
        });
    } else {
      this.infos = infos;
    }
  }

  handleScroll() {
    var that = this;
    $(window).scroll(function() {
      // Handling topbar
      if ($(window)!.scrollTop() || 0 > 0) {
        eventHub.$emit("hideTopBar");
        $(".scrollToTop").fadeIn();
      } else {
        eventHub.$emit("showTopBar");
        $(".scrollToTop").fadeOut();
      }

      // Infinite scrolling : Not working (being called  multipled times hence not good performance whise)
      // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight  && !that.isFecthing) {
      //   that.isFecthing = true;
      //   console.log("do fetch");
      //   fetch("api/InfoData/InfoLiec")
      //     .then(response => response.json() as Promise<InfoLiec[]>)
      //     .then(datas => {
      //       datas.forEach(a => {
      //         that.infos.push(a);
      //       });
      //     });
      // }
      // else{
      //   that.isFecthing = false;;
      // }
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
    eventHub.$emit("onModalClose");
    this.onCloseSidePanelBackground();
  }
}
