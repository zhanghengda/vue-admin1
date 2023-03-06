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
        <el-form-item prop="domain" label="域名:">
          <el-input type="text" v-model="form.domain"></el-input>
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
import { mapState, mapGetters } from 'vuex'
import AreaJson from '@/assets/datas/area.json'
import { create, domainadd, update, domainupdate } from '@/api/user'
let moment = require('moment')
import Editor from '@/components/editor'

import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'addFundDialogs',
  data() {
    return {
      fileList: [],
      token: {
        Authorization: 'Bearer ' + getToken('Token'),
      },
      imageUrl: '',
      areaData: [],
      isVisible: this.isShow,
      form: {
        domain: '',
      },
      form_rules: {
        domain: [
          { required: true, message: '域名地址不能为空！', trigger: 'blur' },
        ],
        sort: [{ required: true, message: '排序不能为空！', trigger: 'blur' }],
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

    handleAvatarSuccess1(res, file) {
      if (res.code == 0) {
        this.form.inspectionEnterpriseLogo = res.data
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

          // edit
          if (this.addFundDialog.type === 'edit') {
            domainupdate(para).then((res) => {
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

            domainadd(para).then((res) => {
              this.$message({
                message: '新增成功',
                type: 'success',
              })
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
