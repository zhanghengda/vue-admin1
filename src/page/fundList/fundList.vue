<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddFundDialog"
      @searchList="searchdata"
      isAllShow
      isGameNameShow
      isGameUrlShow
      isGameCatetoryShow
      isGameStatusShow
      isFilterShow
      isSearchShow
      isUpShow
      isDownShow
      isTagShow
      isExportShow
      isDomainShow
      @todownloadtemplate="todownloadtemplate"
      @onBatchUpItem="onBatchUpItem"
      @onBatchtagItem="onBatchtagItem"
      @onBatchDelItem="onBatchDelItem"
      @onExportItem="onExportItem"
    ></search-item>
    <div class="table_container">
      <el-table
        v-loading="loading"
        :data="tableData"
        :row-style="{ height: '120px', 'max-height': '120px' }"
        style="width: 100%"
        align="center"
        @select="selectTable"
        @select-all="selectAll"
      >
        <el-table-column
          v-if="idFlag"
          prop="id"
          label="id"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column type="selection" align="center" width="60">
        </el-table-column>
        <el-table-column prop="name" label="游戏名称" align="center" width="80">
        </el-table-column>
        <el-table-column
          prop="intro"
          width="180"
          label="游戏介绍"
          align="center"
        >
          <template slot-scope="scope">
            <div class="href-box">
              {{ scope.row.intro }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="logoUrl" width="120" label="logo" align="center">
          <template slot-scope="scope">
            <div class="banner-box">
              <img
                v-if="scope.row.logoUrl"
                class="banner"
                :src="scope.row.logoUrl"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="游戏打分" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.star }}分</div>
          </template>
        </el-table-column>

        <el-table-column prop="tags" width="100" label="标签" align="center">
        </el-table-column>

        <el-table-column
          prop="categorysname"
          width="100"
          label="游戏分类"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="sort"
          width="100"
          label="游戏排序"
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="href"
          width="180"
          label="游戏链接"
          align="center"
        >
          <template slot-scope="scope">
            <div class="href-box">
              {{ scope.row.href }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="href"
          width="180"
          label="发布域名"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.domains">
              <p v-for="item in scope.row.domains">{{ item.domain }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="180" label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <span>
                {{
                  scope.row.status == 0
                    ? '未上架'
                    : scope.row.status == 1
                    ? '已上架'
                    : '已下架'
                }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          sortable
          width="170"
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{
              getTime(scope.row.createTime)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="280"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="mini"
              @click="onEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="delete"
              size="mini"
              @click="onDelete(scope.row, scope.$index)"
              >删除</el-button
            >

            <!-- <el-button
              type="success"
              icon="delete"
              size="mini"
              @click="onEdit(scope.row)"
              >配置 游戏</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        :paginations="paginations"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addFundDialog
        v-if="addFundDialog.show"
        :isShow="addFundDialog.show"
        :dialogRow="addFundDialog.dialogRow"
        @getFundList="searchdata"
        @closeDialog="hideAddFundDialog"
      ></addFundDialog>
      <!-- 批量上传-->
      <el-dialog
        :visible.sync="isUpDownShow"
        :title="upDowntitle"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        @close="toCloseUp"
      >
        <div class="form">
          <el-form
            ref="form"
            :model="form"
            label-width="170px"
            :rules="form_rules"
            style="margin:10px;width:auto;"
          >
            <el-form-item prop="domains" label="上下线域名:">
              <el-checkbox-group v-model="form.domains">
                <el-checkbox
                  :label="item.domain"
                  :v-model="item.id"
                  v-for="(item, index) in domains"
                  :key="item.id"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item class="text_right">
              <el-button @click="isUpDownShow = false">取 消</el-button>
              <el-button type="primary" @click="onUpSubmit('form')"
                >提 交</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <!-- 批量 标签-->
      <el-dialog
        :visible.sync="isTagsShow"
        :title="tagtitle"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        @close="toCloseUp"
      >
        <div class="form">
          <el-form
            ref="form"
            :model="form"
            label-width="170px"
            :rules="form_rules"
            style="margin:10px;width:auto;"
          >
            <el-form-item prop="domains" label="选择标签:">
              <el-checkbox-group v-model="form.tags">
                <el-checkbox
                  :label="item"
                  :v-model="item"
                  v-for="(item, index) in tags"
                  :key="item"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item class="text_right">
              <el-button @click="isTagsShow = false">取 消</el-button>
              <el-button type="primary" @click="onTagSubmit('form')"
                >提 交</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <!-- 批量 标签-->
      <el-dialog
        :visible.sync="isExportShow"
        title="导入游戏"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        @close="toCloseUp"
      >
        <div class="form">
          <el-form
            ref="form"
            :model="form"
            label-width="170px"
            :rules="form_rules"
            style="margin:10px;width:auto;"
          >
            <el-form-item prop="domains" label="选择文件:">
              <el-upload
                class="upload-demo"
                :headers="token"
                :on-success="handleAvatarSuccess1"
                action="/gs/mg/game/importexcel"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传下载模板文件
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as mutils from '@/utils/mUtils'
import SearchItem from './components/searchItem'
import AddFundDialog from './components/addFundDialog'
import Pagination from '@/components/pagination'

import { getToken, setToken, removeToken } from '@/utils/auth'

import {
  getproduct,
  deleteData,
  downloadtemplate,
  gamedel,
  mggamesetdgstatus,
  mggameupdatetags,
  upload,
  mgdomainlist,
  mggamelist,
} from '@/api/user'

let moment = require('moment')

export default {
  data() {
    return {
      isUpDownShow: false,
      isTagsShow: false,
      isExportShow: false,
      upDowntitle: '批量上线',
      tagtitle: '批量打标签',
      tableData: [],
      tableHeight: 0,
      loading: true,
      idFlag: false,
      isShow: false, // 是否显示资金modal,默认为false
      editid: '',
      rowIds: [],
      fileList: [],
      sortnum: 0,
      form: {
        domains: [],
        tags: [],
      },
      token: {
        token: getToken('Token'),
      },
      tags: ['new', 'hot'],
      domains: [],
      format_type_list: {
        0: '提现',
        1: '提现手续费',
        2: '提现锁定',
        3: '理财服务退出',
        4: '购买宜定盈',
        5: '充值',
        6: '优惠券',
        7: '充值礼券',
        8: '转账',
      },
      form_rules: {
        domains: [
          { required: true, message: '选择上线域名！', trigger: 'blur' },
        ],
      },
      uploadparams: {
        type: 1,
        mode: 2,
      },
      addFundDialog: {
        show: false,
        dialogRow: {},
      },

      paginations: {
        pageIndex: 1, // 当前位于哪页
        pageSize: 20, // 1页显示多少条
        pageSizes: [5, 10, 15, 20], //每页显示多少条
        layout: 'total, sizes, prev, pager, next, jumper', // 翻页属性
      },
      pageTotal: 0,
    }
  },
  components: {
    SearchItem,
    AddFundDialog,
    Pagination,
  },
  computed: {
    ...mapGetters(['search', 'categorys']),
    getImgBaseUrl() {
      return localStorage.getItem('baseUrl')
    },
    getTime() {
      return (time) => {
        return moment(time).format('YYYY-MM-DD HH:MM:SS')
      }
    },
  },
  mounted() {
    this.getproductList()
    this.getdomainList()
  },
  methods: {
    setAddress(value) {},
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300
      })
    },
    searchdata() {
      this.paginations.pageIndex = 1
      this.getproductList()
    },
    getproductList() {
      let _this = this
      const param = {
        pageNum: this.paginations.pageIndex,
        pageSize: this.paginations.pageSize,
        searchKey: this.search.searchKey,
        categoryId: this.search.categoryId,
        status: this.search.status,
        domainId: this.search.domainId,
        // domainId:'',
      }
      mggamelist(param).then((res) => {
        this.loading = false
        this.pageTotal = res.data.total

        if (_this.categorys.length > 0) {
          res.data.records.map((t) => {
            let name = ''
            if (t.categoryId != '') {
              let categoryId = t.categoryId.split(',')
              categoryId.map((id, index) => {
                let categoryitem = _this.categorys.find((f) => id == f.id)
                let n = categoryitem ? categoryitem.category : ''
                if (index > 0) name += n + ','
                else name += n
              })
            }

            t.categorysname = name
          })
        }

        this.tableData = res.data.records
      })
    },
    getdomainList() {
      const param = {
        pageNum: 1,
        pageSize: 100,
        searchKey: '',
        // catetoryId:'',
        // status:'',
        // domainId:'',
        // domainId:'',
      }
      mgdomainlist(param).then((res) => {
        this.domains = res.data.records
      })
    },
    handleAvatarSuccess1(res, file) {
      this.getproductList()
      this.$message({
        message: '导入成功',
        type: 'success',
      })
      this.isExportShow = false
    },
    onExportSubmit(form) {},
    //表单提交
    onTagSubmit(form) {
      //表单数据验证完成之后，提交数据;

      let _this = this
      let formData = this[form]

      this.$confirm('确认批量设置选择游戏标签吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          const ids = _this.rowIds
          let tags = formData.tags.join(',')
          const para = { paramIds: ids, tags: tags }

          mggameupdatetags(para).then((res) => {
            _this.$message({
              message: '批量操作成功',
              type: 'success',
            })
            _this.rowIds = []
            _this.getproductList()
            _this.isTagsShow = false
          })
        })
        .catch(() => {})
    },
    //表单提交
    onUpSubmit(form) {
      //表单数据验证完成之后，提交数据;
      let formData = this[form]

      let _this = this

      if (formData.domains.length == 0) {
        this.$message({
          message: '请选择域名',
          type: 'error',
        })
        return
      }
      this.$confirm('确认' + this.upDowntitle + '选择游戏吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          const ids = _this.rowIds
          let domainIds = []
          formData.domains.map((t) => {
            domainIds.push(this.domains.find((d) => d.domain == t).id)
          })
          const para = {
            paramIds: ids,
            status: this.upDowntitle == '批量上线' ? 1 : 2,
            domainIds: domainIds,
          }
          mggamesetdgstatus(para).then((res) => {
            _this.$message({
              message: '批量操作成功',
              type: 'success',
            })
            _this.getproductList()
            _this.rowIds = []
            _this.isUpDownShow = false
          })
        })
        .catch(() => {})
    },
    toCloseUp() {
      this.isUpDownShow = false
      this.isTagsShow = false
      this.isExportShow = false
    },
    // 显示资金弹框
    showAddFundDialog(val) {
      this.$store.commit('SET_DIALOG_TITLE', val)
      this.addFundDialog.show = true
    },
    hideAddFundDialog() {
      this.addFundDialog.show = false
    },
    // 上下分页
    handleCurrentChange(val) {
      this.paginations.pageIndex = val
      //   pageNum: this.paginations.pageIndex,
      // pageSize: this.paginations.pageSize,
      console.log('val', val)
      this.getproductList()
    },
    // 每页显示多少条
    handleSizeChange(val) {
      // this.incomePayData.pageSize = val
      this.paginations.pageIndex = val

      this.getproductList()
    },
    getPay(val) {
      if (mutils.isInteger(val)) {
        return -val
      } else {
        return val
      }
    },

    // 编辑操作方法
    onEdit(row) {
      let row1 = JSON.stringify(row)
      row1 = JSON.parse(row1)
      if (!row1.categoryId) {
        row1.categoryId = []
      } else {
        let categorys = row1.categoryId.split(',')
        row1.categoryId = categorys.map(Number)
      }

      this.addFundDialog.dialogRow = { ...row1, logoUrl1: row1.logoUrl }
      this.showAddFundDialog('edit')
    },
    todownloadtemplate() {
      window.open('http://47.254.23.164:8300/res/template/game_template.xlsx')
    },
    // 删除数据
    onDelete(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          const para = { paramIds: [row.id] }
          gamedel(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.getproductList()
          })
        })
        .catch(() => {})
    },
    onBatchUpItem(type) {
      this.upDowntitle = type == 1 ? '批量上线' : '批量下线'
      this.isUpDownShow = true
    },
    onBatchtagItem() {
      this.isTagsShow = true
    },
    onExportItem() {
      this.isExportShow = true
    },
    onBatchDelItem() {
      this.$confirm('确认批量删除记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          const ids = this.rowIds
          const para = { paramIds: ids }
          gamedel(para).then((res) => {
            this.$message({
              message: '批量删除成功',
              type: 'success',
            })
            this.getproductList()
          })
        })
        .catch(() => {})
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectTable(val, row) {
      this.setSearchBtn(val)
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      val.forEach((item) => {
        this.rowIds.push(item.id)
      })
      this.setSearchBtn(val)
    },
    setSearchBtn(val) {
      let isFlag = true
      this.rowIds = []
      val.map((t) => {
        this.rowIds.push(t.id)
      })
      if (val.length > 0) {
        isFlag = false
      } else {
        isFlag = true
      }
      this.$store.commit('SET_SEARCHBTN_DISABLED', isFlag)
    },
  },
}
</script>

<style lang="less" scoped>
.table_container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
}
.banner-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  .banner {
    height: 120px;
  }
  .logo-banner {
    height: 120px;
  }
}
.el-dialog--small {
  width: 600px !important;
}
.href-box {
  height: 32px;
  font-size: 14px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>
