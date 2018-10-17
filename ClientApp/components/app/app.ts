import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { OkResult } from 'vue/types/vue';

@Component({
    components: {
        MenuComponent: require('../sidebar/sidebar.vue.html'),
        TopbarComponent: require('../topbar/topbar.vue.html')
    }
})
export default class AppComponent extends Vue {
    mounted() {
        debugger;

        var baseUri = "/api/Account/GetUserRoles";
        var value = "";

        fetch(baseUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
        })
            .then(response => {
                debugger;
                if (response.status == 200) {
                    return response;
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(response => response.json() as Promise<OkResult>)
            .then(data => {
                debugger;
                console.log("succesfully gotten : " + data.value);
                this.$userIsConnected = true;
            })
            .catch(err => {
                debugger;
                console.error("Get error : " + err);
                this.$userIsConnected = false;
            });
    }
}
