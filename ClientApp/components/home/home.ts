import Vue from 'vue';
import { Component } from 'vue-property-decorator';

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

    mounted() {
        fetch('api/InfoData/InfoLiec')
            .then(response => response.json() as Promise<InfoLiec[]>)
            .then(data => {
                this.infos = data;
            });
    }

    openModal(){
        var modal = document.getElementById("modalwindow") || null;
        modal!.style.display = "block";
      }

    closeModal(){
          var modal = document.getElementById("modalwindow");
        modal!.style.display = "none";
      }
}
