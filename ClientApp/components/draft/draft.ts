import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";
import eventHub from "../eventhub/eventhub";

interface InfoLiec {
  title: string;
  context: string;
  image: string;
  sources: string[];
  tags: string[];
  lightTheme: string;
  normalTheme: string;
  darkTheme: string;
  theme: string;
  creationDate: string;
  creator: string;
  creationdate: string;
}

interface Image {
  url : string;
  name : string;
  id : string;
}

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

@Component
export default class CreateComponent extends Vue {
  info: InfoLiec = {
    title: "",
    context: "",
    image: "",
    sources: [],
    tags: [],
    lightTheme: "",
    normalTheme: "",
    darkTheme: "",
    theme: "",
    creationDate: "",
    creator: "",
    creationdate: ""
  };
  isOk: boolean = false;
  uploadedFile: Image = { url : "", name : "", id : ""};
  uploadError: string = "";
  currentStatus: number = 0;

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
      .then(response => response.json() as Promise<Image>)
      .then(data => {
        console.log("succesfully uploaded : " + data);
        this.uploadedFile = data;
        this.currentStatus = STATUS_SUCCESS;
      })
      .catch(err => {
        this.uploadError = err.response;
        this.currentStatus = STATUS_FAILED;
      });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    var baseUri = "/api/InfoData/CreateInfoLiec";

    console.log("create");

    fetch(baseUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.info)
    }).then(response => {
      this.isOk = response.ok;
    });
  }

  handleScroll() {
    var that = this;
    console.log($(window)!.scrollTop());
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
