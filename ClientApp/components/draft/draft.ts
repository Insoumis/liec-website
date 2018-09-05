import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

interface InfoLiecViewModel {
  title: string;
  context: string;
  text: string;
  image: string;
  sources: string[];
  tags: string[];
  lightTheme: string;
  normalTheme: string;
  darkTheme: string;
  creationDate: string;
  theme: string;
  creator: string;
}

interface Image {
  url : string;
  name : string;
}

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

@Component
export default class CreateComponent extends Vue {
  info: InfoLiecViewModel = {
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
    creator: ""
  };
  isSuccessDisplayed: boolean = false;
  isSubmitDisplayed: string = "inline-block";
  uploadedFile: Image = { url : "", name : ""};
  uploadError: string = "";
  submitError : string = "";
  currentStatus: number = 0;
  unspilttedTags : string = "";
  unsplittedSources : string = "";

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  mounted() {
    window.onscroll = this.handleScroll;
  }

  isInitial() {
    return this.currentStatus === STATUS_INITIAL;
  }

  isSaving() {
    return this.currentStatus === STATUS_SAVING;
  }

  isSuccess() {
    return this.currentStatus === STATUS_SUCCESS;
  }

  isFailed() {
    return this.currentStatus === STATUS_FAILED;
  }

  isSubmitError(){
    return this.submitError !== "";
  }

  openDraft(){
    window.open("/draft","_self");
  }

  filesChange(fieldName: string, fileList: File[]) {
    
    const formData = new FormData();

    if (!fileList.length) return;
    
    for (var i = 0; i < fileList.length; i++) {
      formData.append("file" + fileList, fileList[i]);
    };
    
      this.save(formData);
  }

  save(formData: FormData) {
    // upload data to the server
    this.currentStatus = STATUS_SAVING;
    var baseUri = "/api/InfoData/UploadImage";
    console.log(baseUri);
    fetch(baseUri, {
      method: "POST",
      body: formData
    })
      .then(response => response.json() as Promise<Array<Image>>)
      .then(data => {
        console.log("succesfully uploaded : " + data);
        this.uploadedFile = data[0];
        this.info.image = data[0].url;
        this.currentStatus = STATUS_SUCCESS;
      })
      .catch(err => {
        this.uploadError = err.response;
        this.currentStatus = STATUS_FAILED;
      });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    var baseUri = "/api/InfoData/CreateContent";

    this.info.tags = this.unspilttedTags.split(",");
    this.info.sources = this.unsplittedSources.split(",");

    console.log("create")
    console.log(this.info.theme);
    console.log(this.info.creator);
    console.log(this.info.tags);
    console.log(this.info.image);

    fetch(baseUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.info)
    }).then(response => {
      this.isSuccessDisplayed = response.ok ? true : false;
      this.isSubmitDisplayed = response.ok ? "none" : "inline-block";
      this.submitError = response.ok ? "" : "¯\\_(ツ)_/¯ Mince ! Une erreur est survenue ! Vérifies tes champs, une erreur doit-s'y être cachée. ( ͡° ͜ʖ ͡°)"
      console.log(response.statusText);
    })
    .catch(err => {
      this.submitError = err.response;
    });;
  }

  handleScroll() {
    var that = this;
    // console.log($(window)!.scrollTop());
    $(window).scroll(function() {
      // Handling topbar
      if ($(window)!.scrollTop() || 0 > 0) {
        eventHub.$emit("hideTopBar");
      } else {
        eventHub.$emit("showTopBar");
      }
    });
  }
}
