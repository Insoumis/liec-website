import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface InfoLiec {
    title: string;
    context: string;
    image: string;
    sources: string[];
    tags: string[];
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
}
