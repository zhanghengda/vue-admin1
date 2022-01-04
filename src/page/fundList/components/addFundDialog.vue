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
        <el-form-item prop="productNo" label="溯源号码:">
          <el-input type="text" v-model="form.productNo"></el-input>
        </el-form-item>
        <el-form-item prop="identifyCode" label="防伪码（4位）:">
          <el-input type="text" v-model="form.identifyCode"></el-input>
        </el-form-item>

        <el-form-item label="产品名称:">
          <el-input type="text" v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="横幅图">
          <el-upload
            class="upload-demo"
            action="/api/picture/upload"
            :on-preview="handlePreview"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :headers="token"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过5M
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="鉴定企业名称:">
          <el-input type="text" v-model="form.inspectionEnterprise"></el-input>
        </el-form-item>
        <el-form-item label="鉴定企业名称:">
          <el-upload
            class="avatar-uploader"
            action="/api/picture/upload"
            :show-file-list="false"
            :headers="token"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
          >
            <div class="el-upload">
              <img
                v-if="this.form.inspectionEnterpriseLogo"
                :src="getImgBaseUrl + form.inspectionEnterpriseLogo"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="原产地:">
          <el-input type="text" v-model="form.sourceArea"></el-input>
        </el-form-item>
        <el-form-item label="生产企业:">
          <el-input type="text" v-model="form.produceEnterprise"></el-input>
        </el-form-item>
        <el-form-item label="委托单位:">
          <el-input type="text" v-model="form.trustCompany"></el-input>
        </el-form-item>
        <el-form-item label="序列号:">
          <el-input type="text" v-model="form.serialNo"></el-input>
        </el-form-item>
        <el-form-item label="检验日期:">
          <el-date-picker
            v-model="form.inspectionDate"
            type="date"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检验结论:">
          <el-input v-model="form.inspectionResult"></el-input>
        </el-form-item>
        <el-form-item label="企业信息:">
          <Editor
            @listenToDetail="getDetail"
            :description="form.enterpriseInfo"
            :uploadKey="'marketInfo'"
          ></Editor>
        </el-form-item>
        <el-form-item label="资质信息:">
          <Editor
            @listenToDetail="getDetail2"
            :description="form.qualificationInfo"
            :uploadKey="'marketInfo2'"
          ></Editor>
        </el-form-item>
        <el-form-item label="委托方简介:">
          <Editor
            @listenToDetail="getDetail1"
            :description="form.trustInfo"
            :uploadKey="'marketInfo1'"
          ></Editor>
        </el-form-item>
        <el-form-item label="委托方简介记录日期:">
          <el-date-picker
            v-model="form.trustInfoRecordDate"
            type="date"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期:">
          <el-date-picker
            v-model.number="form.expireDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="产品备注:">
          <Editor
            @listenToDetail="getDetail3"
            :description="form.productRemark"
            :uploadKey="'marketInfo3'"
          ></Editor>
        </el-form-item>
        <el-form-item label="追溯链接:">
          <el-input v-model="form.traceLink"></el-input>
        </el-form-item>
        <el-form-item label="是否发布正式:">
          <el-checkbox v-model="form.isPublic"></el-checkbox>
        </el-form-item>
        <el-form-item label="是否显示客服信息:">
          <el-checkbox v-model="form.needTips"></el-checkbox>
        </el-form-item>
        <el-form-item label="是否显示二维码:">
          <el-checkbox v-model="form.needQrCode"></el-checkbox>
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
import { create, update } from '@/api/user'
let moment = require('moment')
import Editor from '@/components/editor'

import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'addFundDialogs',
  data() {
    return {
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        // },
        // {
        //   name: 'food2.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        // },
      ],
      token: {
        Authorization: 'Bearer ' + getToken('Token'),
      },
      imageUrl: '',
      areaData: [],
      isVisible: this.isShow,
      form: {
        productNo: '',
        identifyCode: '',
        /** 产品名称 */
        productName: '',
        /** 横幅图 */
        bannerImg: '',
        /** 鉴定企业名称 */
        inspectionEnterprise: '',
        //鉴定logo
        inspectionEnterpriseLogo: '',
        /** 原产地 */
        sourceArea: '',
        /** 生产企业 */
        produceEnterprise: '',
        /** 委托单位 */
        trustCompany: '',
        /** 序列号 */
        serialNo: '',
        /** 检验日期 */
        inspectionDate: '',
        /** 检验结论 */
        inspectionResult: '',
        /** 产品备注 */
        productRemark: '',
        /** 企业信息 */
        enterpriseInfo: '',
        /** 资质信息 */
        qualificationInfo: '',
        /** 委托方简介 */
        trustInfo: '',
        /** 委托方简介记录日期 */
        trustInfoRecordDate: '',
        /** 到期日期 */
        expireDate: '',
        /** 创建时间 */
        createTime: '',
        /** 追溯链接 */
        traceLink: '',
        needTips: true,
        needQrCode: true,
        isPublic: false,
      },
      form_rules: {
        productNo: [
          { required: true, message: '产品编号不能为空！', trigger: 'blur' },
        ],
        identifyCode: [
          { required: true, message: '防伪码不能为空！', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
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
  },
  mounted() {
    if (this.addFundDialog.type === 'edit' || this.dialogRow) {
      this.form = this.dialogRow
      console.log(this.form)
      this.form.inspectionDate = this.form.inspectionDate
        ? this.form.inspectionDate.replace(/\./g, '-')
        : ''
      // this.form.trustInfoRecordDate='2021-12-03'

      if (this.form.bannerImg) {
        let imgs = this.form.bannerImg.split(',')

        imgs.map((item) => {
          this.fileList.push({
            url: localStorage.getItem('baseUrl') + item,
            url2: item,
          })
        })
      }
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
          let arrnew = this.fileList
            .map((obj, index) => {
              return obj.url2
            })
            .join(',')
          formData.bannerImg = arrnew
          formData.productNo = formData.productNo.replace(/\s/g, '')
          formData.identifyCode = formData.identifyCode.replace(/\s/g, '')
          formData.inspectionDate = moment(formData.inspectionDate).format(
            'YYYY-MM-DD'
          )
          // formData.inspectionDate = formData.inspectionDate.replace(/\-/g, '.')
          formData.trustInfoRecordDate = moment(
            formData.trustInfoRecordDate
          ).format('YYYY-MM-DD')
          formData.expireDate = moment(formData.expireDate).format(
            'YYYY-MM-DD HH:MM:SS'
          )
          const para = Object.assign({}, formData)
          console.log(para)
          // edit
          if (this.addFundDialog.type === 'edit') {
            update(para).then((res) => {
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
            create(para).then((res) => {
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
