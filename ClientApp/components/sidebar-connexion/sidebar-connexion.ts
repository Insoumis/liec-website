import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

interface RegisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
}

@Component
export default class ConnexionComponent extends Vue {
    register: RegisterViewModel = {
        email: "",
        password: "",
        confirmPassword: "",
    }
    isDisplayed: string = "none";
    GDPRConsent: boolean = false;
    isRegisterSuccessDisplayed: boolean = false;
    isLoginSuccessDisplayed: boolean = false;
    submitRegisterError: string = "";
    submitLoginError: string = "";

    mounted() {
        eventHub.$on("onOpenConnexion", this.onOpenConnexion);
        eventHub.$on("closeConnexion", this.closeConnexion);
    }

    isSubmitRegisterError() {
        return this.submitRegisterError !== "";
    }

    isSubmitLoginError() {
        return this.submitLoginError !== "";
    }

    onOpenConnexion() {
        this.isDisplayed = "block";
    }

    closeConnexion() {
        this.isDisplayed = "none";
    }

    handleSubmitToRegister(e: Event) {
        debugger;
        e.preventDefault();
        var baseUri = "/api/Account/Register";

        console.log("create user")
        console.log(this.register.email);
        console.log(this.register.password);
        console.log(this.register.confirmPassword);

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.register)
        }).then(response => {
            this.isRegisterSuccessDisplayed = response.ok ? true : false;
            this.submitRegisterError = response.ok ? "" : "¯\\_(ツ)_/¯ Mince ! Une erreur est survenue ! Vérifies tes champs, une erreur doit-s'y être cachée. ( ͡° ͜ʖ ͡°)"
            console.log(response.statusText);
            console.log(response.status);
        })
            .catch(err => {
                this.submitRegisterError = err.response;
            });;
    }

    handleSubmitToLogin(e: Event) {
        debugger;
        e.preventDefault();
        var baseUri = "/api/Account/Login";

        console.log("log user in")
        console.log(this.register.email);
        console.log(this.register.password);

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.register)
        }).then(response => {
            this.isLoginSuccessDisplayed = response.ok ? true : false;
            this.submitLoginError = response.ok ? "" : "¯\\_(ツ)_/¯ Mince ! Une erreur est survenue ! Vérifies tes champs, une erreur doit-s'y être cachée. ( ͡° ͜ʖ ͡°)"
            console.log(response.statusText);
            console.log(response.status);
        })
            .catch(err => {
                this.submitLoginError = err.response;
            });;
    }
}
