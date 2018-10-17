import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";
import { InfoLiecViewModel, OkResult } from "vue/types/vue";
//import { WatchOptions } from "vue/types/options";
//import * as Router from 'vue-router'

@Component
export default class ModalComponent extends Vue {
    //contentId: string = this.$route.params.id;
    info: InfoLiecViewModel = {
        id: "",
        title: "",
        context: "",
        text: "",
        image: "",
        sources: [],
        tags: [],
        lightTheme: "",
        normalTheme: "",
        darkTheme: "",
        theme: "",
        creationDate: "",
        creator: "",
        twitterUrl: "",
        facebookUrl: "",
        instagramUrl: ""
    };
    modalOffset = document.body.scrollTop;
    isDisplayed: string = "none";

    mounted() {
        eventHub.$on("onOpenModal", this.openModal);
        if (this.$route.params.id !== undefined) {
            var baseUri = "/api/InfoData/GetContentById";
            var value = this.$route.params.id;

            console.log("get content " + value);

            fetch(baseUri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(value)
                })
                .then(response => {
                    if (response.ok) {
                        return response;
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then(response => response.json() as Promise<OkResult>)
                .then(data => {
                    var dataT = data.value as InfoLiecViewModel;
                    console.log("succesfully gotten : " + dataT.id);
                    this.openModal(dataT);
                })
                .catch(err => {
                    console.error("Get error : " + err);
                });
        }
    }
    
    sourceShortener(src: string) {
        var result = "";
        var srcArray = src
            .replace("http://", "")
            .replace("https://", "")
            .replace("www", "")
            .split("/");

        if (srcArray.length > 1) {
            result = srcArray[0];

            if (result.charAt(0) == ".") result = result.substr(1, result.length);
        } else result = src;

        return result;
    }

    openModal(infoLiec: InfoLiecViewModel) {
        this.info = infoLiec;
        this.isDisplayed = "block";
        this.modalOffset = document.body.scrollTop;
        $("body").addClass("modal-open");
    }

    closeModal() {
        this.isDisplayed = "none";
        $("body").removeClass("modal-open");
        $("body").scrollTop(this.modalOffset);
    }

    hoverlink() {
        $(".sources-link a:hover").css("color", this.info.lightTheme);
        $(".sources-link .link-modal:hover").css("color", this.info.lightTheme);
        $(".tag-item a:hover").css("color", this.info.lightTheme);
        $(".tag-item .link-modal:hover").css("color", this.info.lightTheme);
    }

    normallink() {
        $(".sources-link a").css("color", "#fff");
        $(".tag-item a").css("color", "#fff");
    }
}
