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
  creationDate: string;
}

@Component
export default class ModalComponent extends Vue {
  info: InfoLiec = {
      title :"",
      context: "",
      image: "",
      sources: [],
      tags : [],
      lightTheme: "",
      normalTheme: "",
      darkTheme: "",
      creationDate: "",
    };
    modalOffset = document.body.scrollTop;
    isDisplayed: string = "none";

    mounted() {
      eventHub.$on('onOpenModal', this.openModal);
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
  
    openModal (infoLiec : InfoLiec, ) {
      this.info = infoLiec;
      this.isDisplayed = 'block';
      this.modalOffset = document.body.scrollTop;
      $("body").addClass("modal-open");
      
    }

    closeModal() {
        this.isDisplayed = 'none';
        $("body").removeClass("modal-open");
        $("body").scrollTop(this.modalOffset);
        
    }

    hoverlink(){
      $(".sources-link a:hover").css("color", this.info.lightTheme);
      $(".tag-item a:hover").css("color", this.info.lightTheme);
    }

    normallink(){
      $(".sources-link a").css("color", "#fff");
      $(".tag-item a").css("color", "#fff");
    }
}
