<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="addFundDialog.title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    @close="closeDialog"
  >
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        label-width="170px"
        :rules="form_rules"
        style="margin:10px;width:auto;"
      >
        <el-form-item prop="name" label="游戏名称:">
          <el-input type="text" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item prop="href" label="游戏链接:">
          <el-input type="text" v-model="form.href"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="href" label="游戏排序:">
          <el-input type="text" v-model="form.sort"></el-input>
        </el-form-item> -->
        <el-form-item prop="categoryId" label="游戏分类:">
          <el-select v-model="form.categoryId" placeholder="请选择" multiple>
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.category"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-model="form.logoUrl" label="游戏logo:">
          <el-upload
            class="avatar-uploader"
            action="/gs/comm/fileupload"
            :show-file-list="false"
            :data="uploadparams"
            :headers="token"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
          >
            <div class="el-upload">
              <img v-if="form.logoUrl1" :src="form.logoUrl1" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item v-model="form.logoUrl" label="游戏描述:">
          <el-input type="textarea" v-model="form.intro"></el-input>
        </el-form-item>

        <el-form-item label="游戏打分:">
          <el-rate v-model="form.star"></el-rate>
        </el-form-item>
        <el-form-item class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import AreaJson from '@/assets/datas/area.json'
import { mggameupdate, mggameadd, categorylist } from '@/api/user'
let moment = require('moment')
import Editor from '@/components/editor'

import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'addFundDialogs',
  data() {
    return {
      fileList: [],
      categorys: [],
      token: {
        token: getToken('Token'),
      },
      imageUrl: '',
      areaData: [],
      isVisible: this.isShow,
      uploadparams: {
        type: 1,
        mode: 2,
      },
      form: {
        star: 5,
        name: '',
        href: '',
        intro: '',
        categoryId: [],
        logoUrl: '',
      },
      form_rules: {
        name: [
          { required: true, message: '游戏名称不能为空！', trigger: 'blur' },
        ],
        href: [
          { required: true, message: '游戏链接不能为空！', trigger: 'blur' },
        ],
        intro: [
          { required: true, message: '游戏介绍不能为空！', trigger: 'blur' },
        ],
        categoryId: [
          { required: true, message: '请选择游戏类型！', trigger: 'blur' },
        ],
      },
      //详情弹框信息
      dialog: {
        width: '400px',
        formLabelWidth: '120px',
      },
    }
  },
  components: {
    Editor,
  },
  props: {
    isShow: Boolean,
    dialogRow: Object,
  },
  computed: {
    ...mapGetters(['addFundDialog']),
    getImgBaseUrl() {
      return localStorage.getItem('baseUrl')
    },
  },
  created() {
    this.areaData = AreaJson
    this.oncategorylist()
  },
  mounted() {
    let _this = this

    if (this.addFundDialog.type === 'edit' && this.dialogRow) {
      _this.form = _this.dialogRow
    } else {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    }
  },
  methods: {
    ...mapMutations({
      SET_CATEGORYS: 'user/SET_CATEGORYS',
    }),
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    getDetail(data) {
      this.form.enterpriseInfo = data
    },
    getDetail1(data) {
      this.form.trustInfo = data
    },
    getDetail2(data) {
      this.form.qualificationInfo = data
    },
    getDetail3(data) {
      this.form.productRemark = data
    },

    //获取分类
    oncategorylist() {
      const param = {
        pageNum: 0,
        pageSize: 100,
      }
      categorylist(param).then((res) => {
        this.categorys = res.data.records
        this.$store.commit('SET_CATEGORYS', this.categorys)
      })
    },
    handleAvatarSuccess1(res, file) {
      if (res.code == 0) {
        this.form.logoUrl1 = 'http://47.254.23.164:8300' + res.data.fileUrl
        this.form.logoUrl = res.data.fileUrl
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        this.fileList.push({
          url: localStorage.getItem('baseUrl') + res.data,
          url2: res.data,
        })
        console.log(file, res, this.fileList)
      }
      //   this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isLt2M
    },
    handlePreview(file) {
      console.log(file)
    },
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var item of opt) {
          if (item.value == value) {
            opt = item.children
            return item.label
          }
        }
        return null
      })
    },
    handleChange(value) {
      console.log([...value]) // ["120000", "120200", "120223"]
      this.form.address = [...value]
      let vals = this.getCascaderObj([...value], this.areaData) // arr
      this.form.tableAddress = vals.join(',').replace(/,/g, '')
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    //表单提交
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let formData = this[form]
          const para = Object.assign({}, formData)
          para.categoryId = para.categoryId.join(',')
          // edit
          if (this.addFundDialog.type === 'edit') {
            mggameupdate(para).then((res) => {
              this.oncategorylist()

              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.$refs['form'].resetFields()
              this.isVisible = false
              this.$emit('getFundList')
            })
          } else {
            // add
            mggameadd(para).then((res) => {
              this.$message({
                message: '新增成功',
                type: 'success',
              })
              this.oncategorylist()

              this.$refs['form'].resetFields()
              this.isVisible = false
              this.$emit('getFundList')
            })
          }
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.search_container {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.btnRight {
  float: right;
  margin-right: 0px !important;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 18px 18px 0;
}
</style>
