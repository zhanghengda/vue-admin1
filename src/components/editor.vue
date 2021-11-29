<template>
  <div class="editor-box">
    <quill-editor ref="myTextEditor" v-model="content" @change="onEditorChange($event)"></quill-editor>
  </div>
</template>

<script type="text/ecmascript-6">
//	import browserMD5File from 'browser-md5-file'

import "../../node_modules/quill/dist/quill.core.css";
import "../../node_modules/quill/dist/quill.snow.css";
import "../../node_modules/quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import qs from "qs";
import { upload } from '@/api/user'

export default {
    components:{
quillEditor
  },
  props: {
    description: {
      type: String,
      default: ""
    },
    uploadKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      content: "",
      editorOption: {},
      token: ""
    };
  },

  created() {
    /*this.cityData = CityInfo*/
    this.content = this.description;
  },
  mounted() {
    this.$refs.myTextEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgClick);
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  methods: {
    imgClick() {
      var input = document.createElement("input");
      input.type = "file";
      input.name = this.fileName;
      input.accept = "image/jpeg,image/png,image/jpg,image/gif";
      input.onchange = this.onFileChange;
      input.click();
    },
    onFileChange(e) {
      let that = this;
      var fileInput = e.target;
      // ${fileInput.files[0]}
      const parmas = new FormData();
      parmas.append("file", fileInput.files[0]);
      // parmas.append("key", this.uploadKey);
      // parmas.append("file", fileInput.files[0]);

     
     upload(parmas).then(res => {
        this.$message.success("上传成功");
        let data = sessionStorage.getItem('baseurl') + res.data.data;

        that.editor.insertEmbed(
          that.editor.getSelection().index,
          "image",
          data
        );
      });
    },
    onEditorChange({ quill, html, text }) {
      this.$emit("listenToDetail", html);
    }
  },
  watch: {
    description(val) {
      this.content = val;
    }
  }
};
</script>

<style lang="less" scoped>
.ql-toolbar {
  text-align: left;
}
body .ql-editor {
  height: 350px;
}
</style>