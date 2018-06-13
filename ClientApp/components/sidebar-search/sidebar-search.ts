import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

interface SearchViewModel {
  tags: string[];
  date: string;
  themes: string[];
  freeSearchText: string;
}

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
export default class SearchComponent extends Vue {
  isDisplayed: string = "none";
  errors: string[] = [];
  searchVm: SearchViewModel = {
    tags: [],
    date: "",
    themes: [],
    freeSearchText: ""
  };
  imageRed: string = "../../../wwwroot/content/logo-vert-1.png";

  mounted() {
    eventHub.$on("onOpenSearch", this.onOpenSearch);
    eventHub.$on("onCloseSearch", this.closeSearch);
    $(".theme").on("click", function(e) {
      $(this).toggleClass("active", !$(this).hasClass("active"));
      var id = $(this).attr("for");
      $("#" + id).trigger("click");
    });
  }

  onOpenSearch() {
    this.isDisplayed = "block";
    eventHub.$emit("hideTopBar");
    eventHub.$emit("switchSidePanelBackground");
  }

  closeSearch() {
    this.isDisplayed = "none";
    eventHub.$emit("showTopBar");
    eventHub.$emit("switchSidePanelBackground");
  }

  handleSubmit(e: Event) {
    this.errors = [];
    e.preventDefault();

    this.searchVm.date = "2018-06-13";

    var baseUri = "http://localhost:5000/api/InfoData/Search";
    var esc = encodeURIComponent;
    var query = Object.keys(this.searchVm)
      .map(k => esc(k) + "=" + esc(this.searchVm[k]))
      .join("&");

    var url = baseUri + "&" + query;
    console.log(JSON.stringify(this.searchVm));
    console.log(baseUri);

  
    $.ajax({
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: baseUri,
      type: "get",
      data : JSON.stringify(this.searchVm),
      success: function (response) {
          console.log(response);
          eventHub.$emit("updateInfo", this.$data);
          eventHub.$emit("onCloseSearch");
      },
      error: function () {
          console.log("Oops");
      }
  });

    // fetch(baseUri, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(this.searchVm)
    // })
    //   .then(response => response.json() as Promise<InfoLiec[]>)
    //   .then(data => {
    //     eventHub.$emit("updateInfo", data);
    //   });
  }
}
