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
      darkTheme: ""
    };
    isDisplayed : string = "none";

    mounted() {
      eventHub.$on('onOpenModal', this.openModal);
    }
  
    openModal (infoLiec : InfoLiec) {
      console.log("opening......")
      this.info = infoLiec;
      this.isDisplayed = 'block';
    }

    closeModal() {
      console.log("closing...")
        this.isDisplayed = 'none';
      }
}
