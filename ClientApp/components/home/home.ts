import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";

interface InfoLiec {
  title: string;
  context: string;
  image: string;
  sources: string[];
  tags: string[];
  theme: string;
}

@Component
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

  scrollToTop(){
    $(".scrollToTop").fadeOut();
    window.scrollTo(0, 0);    
  }

  openModal() {
    var modal = document.getElementById("modalwindow");
    modal!.style.display = "block";
  }

  closeModal() {
    var modal = document.getElementById("modalwindow");
    modal!.style.display = "none";
  }
}
