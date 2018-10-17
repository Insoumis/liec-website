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
  unsplitTags: string = "";
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
  }

  closeSearch() {
    this.isDisplayed = "none";
  }

  handleSubmit(e: Event) {
    this.errors = [];
    e.preventDefault();

    this.searchVm.tags = this.unsplitTags.split(",");
    var baseUri = "/api/InfoData/Search";

    console.log(baseUri);

    fetch(baseUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.searchVm)
    })
      .then(response => response.json() as Promise<InfoLiec[]>)
      .then(datas => {
        datas.forEach(data => {
          data.creationDate = data.creationDate.substring(0, 10);
        });
        eventHub.$emit("updateInfo", datas);
        eventHub.$emit("onCloseSearch");
          eventHub.$emit("closeSidePanelBackground");
          eventHub.$emit("showTopBar");          
      });
  }
}
