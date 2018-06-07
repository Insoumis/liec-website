import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from '../eventhub/eventhub'

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
        ModalComponent: require('../home_modal/home_modal.vue.html')
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
    eventHub.$on('onOpenModal', this.onOpenModal);
  }

  handleScroll() {
    console.log("scrolling...");
    $(window).scroll(function() {
      if ($(window)!.scrollTop() || 0 > 0) {
        $(".top-nav").fadeOut();
        $(".scrollToTop").fadeIn();
      } else {
        $(".top-nav").fadeIn();
        $(".scrollToTop").fadeOut();
      }
    });
  }

  openModal(info : InfoLiec){
      console.log("emitting...")
      eventHub.$emit('onOpenModal', info);
  }

  onOpenModal(info : InfoLiec){
    console.log("get it...")
}

  scrollToTop(){
    $(".scrollToTop").fadeOut();
    window.scrollTo(0, 0);    
  }
}
