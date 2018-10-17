import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

@Component
export default class TopBarComponent extends Vue {
    mounted() {
        eventHub.$on("hideTopBar", this.onHideTopBar);
        eventHub.$on("showTopBar", this.onShowTopBar);
    }

    isUserConnected() {
        console.log("is user connected :" + this.$userIsConnected);
        return this.$userIsConnected;
    }

    openLogin() {
        window.open("/login", "_self");
    }

    onHideTopBar() {
        //console.log("hide topbar");
        if ($(".top-nav").css("display") != "none") {
            $(".top-nav").fadeOut();
        }
    }

    onShowTopBar() {
        //console.log("show topbar");
        if ($(".top-nav").css("display") == "none" && !($(window)!.scrollTop() || 0 > 0)) {
            $(".top-nav").fadeIn();
        }
    }
}
