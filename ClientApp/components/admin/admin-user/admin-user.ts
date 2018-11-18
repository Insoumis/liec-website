import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../../eventhub/eventhub";

interface UserViewModel {
    email: string;
    roles: string[],
    emailconfirmed: boolean,
    GDPRConsent: boolean
}

@Component
export default class ConnexionComponent extends Vue {
    user: UserViewModel = {
        email: "",
        roles: [],
        emailconfirmed: false,
        GDPRConsent : false
    }

    mounted() {
    }

    handleSubmitToRegister(e: Event) {
        debugger;
        e.preventDefault();
        var baseUri = "/api/Account/GetAllUsers";
        var form = $('#register-form');
        var token = $('input[name="__RequestVerificationToken"]', form).val() as string;
        token = $('input[name="__RequestVerificationToken"]').val() as string;

        console.log("get all users");

        console.log(token);

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'RequestVerificationToken': token
            },
            body: JSON.stringify("")
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
                        console.log(errorMessage + errors + "( ͡° ͜ʖ ͡°)");
                    });
            }
            else {
                response.json().then(json => json as Promise<string>)
                    .then(data => {
                        debugger;
                        this.$userIsConnected = true;
                    });
            }

            var success = response.ok ? true : false;
            console.log(response.statusText);
            console.log(response.status);
        })
            .catch(err => {
                console.log("ERROR : err.response");
            });;
    }

    requestGetAllUsers(e: Event) {
        debugger;
        e.preventDefault();
        var baseUri = "/api/Account/UpdateUser";
        var token = $('input[name="__RequestVerificationToken"]').val() as string;

        console.log("update user");
        console.log(this.user.email);
        console.log(this.user.roles);
        console.log(this.user.emailconfirmed);
        console.log(this.user.GDPRConsent);
        console.log(token);

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'RequestVerificationToken': token
            },
            body: JSON.stringify(this.user)
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
                        console.log(errorMessage + errors + "( ͡° ͜ʖ ͡°)");
                    });
            }
            else {
                response.json().then(json => json as Promise<string>)
                    .then(data => {
                        debugger;
                    });
            }

            var success = response.ok ? true : false;
            console.log(response.statusText);
            console.log(response.status);
        })
            .catch(err => {
                console.log("ERROR : " + err.response);
            });;
    }
}
