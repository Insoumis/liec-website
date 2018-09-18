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
        return !this.isRegisterSuccessDisplayed;
    }

    isSubmitLoginError() {
        return !this.isLoginSuccessDisplayed;
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
        var form = $('#register-form');
        var token = $('input[name="__RequestVerificationToken"]', form).val() as string;
        token = $('input[name="__RequestVerificationToken"]').val() as string;

        console.log("create user");
        console.log(this.register.email);
        console.log(this.register.password);
        console.log(this.register.confirmPassword);
        console.log(token);

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'RequestVerificationToken': token
            },
            body: JSON.stringify(this.register)
        }).then(response => {

            if (!response.ok) {
                response.json().then(json => json as Promise<string[]>)
                    .then(datas => {
                        debugger;

                        var errors = "<ul>";
                        datas.forEach((error, index, array) => {
                            errors+="<li>" + error + "</li>"
                        });
                        errors += "</ul>";

                        var errorMessage = "¯\\_(ツ)_/¯ Mince ! Une ou plusieurs erreures sont survenues : ";
                        $("#submitRegisterError").append(this.isRegisterSuccessDisplayed ? "" : errorMessage + errors + "( ͡° ͜ʖ ͡°)");
                    });
            }
            else {
                response.json().then(json => json as Promise<string>)
                    .then(data => {
                        debugger;
                    });
            }

            this.isRegisterSuccessDisplayed = response.ok ? true : false;
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
        var form = $('#login-form');
        var token = $('input[name="__RequestVerificationToken"]').val() as string;

        console.log("log user in");
        console.log(this.register.email);
        console.log(this.register.password);
        console.log(token);

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'RequestVerificationToken': token
            },
            body: JSON.stringify(this.register)
        }).then(response => {
            if (!response.ok) {
                response.json().then(json => json as Promise<string[]>)
                    .then(datas => {
                        debugger;

                        var errors = "<ul>";
                        datas.forEach((error, index, array) => {
                            errors += "<li>" + error + "</li>"
                        });
                        errors += "</ul>";

                        var errorMessage = "¯\\_(ツ)_/¯ Mince ! Une ou plusieurs erreures sont survenues : ";
                        $("#submitLoginError").append(this.isLoginSuccessDisplayed ? "" : errorMessage + errors + "( ͡° ͜ʖ ͡°)");
                    });
            }
            else {
                response.json().then(json => json as Promise<string>)
                    .then(data => {
                        debugger;
                    });
            }

            this.isLoginSuccessDisplayed = response.ok ? true : false;
            console.log(response.statusText);
            console.log(response.status);
        })
            .catch(err => {
                this.submitLoginError = err.response;
            });;
    }
}
