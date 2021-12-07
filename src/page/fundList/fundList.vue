<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddFundDialog"
      @searchList="getproductList"
      @onBatchDelItem="onBatchDelItem"
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
          width="180"
        >
        </el-table-column>
        <el-table-column type="selection" align="center" width="60">
        </el-table-column>
        <el-table-column
          prop="productNo"
          label="溯源号码"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="identifyCode"
          label="防伪码（4位）"
          align="center"
          width="80"
        >
        </el-table-column>

        <el-table-column
          prop="productName"
          width="180"
          label="产品名称"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="bannerImg"
          width="180"
          label="横幅图"
          align="center"
        >
          <template slot-scope="scope">
            <div class="banner-box">
              <img
                v-if="scope.row.bannerImg"
                v-for="(item, index) in scope.row.bannerImg.split(',')"
                class="banner"
                :src="getImgBaseUrl + item"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="inspectionEnterprise"
          label="鉴定企业名称"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="inspectionEnterpriseLogo"
          label="鉴定企业logo"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div class="banner-box">
              <img
                v-if="scope.row.inspectionEnterpriseLogo"
                class="logo-banner"
                :src="getImgBaseUrl + scope.row.inspectionEnterpriseLogo"
                alt=""
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="sourceArea"
          width="80"
          label="原产地"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="produceEnterprise"
          label="生产企业"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="trustCompany"
          width="180"
          label="委托单位"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="serialNo"
          width="80"
          label="序列号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="检验日期"
          align="center"
          sortable
          width="170"
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{
              scope.row.inspectionDate
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inspectionResult"
          label="检验结论"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="180"
          prop="productRemark"
          label="产品备注"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column
          width="450"
          prop="enterpriseInfo"
          label="企业信息"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="qualificationInfo"
          label="资质信息"
          width="450"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="trustInfo"
          width="450"
          label="委托方简介"
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="createTime"
          label="委托方简介记录日期"
          align="center"
          sortable
          width="170"
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{
              scope.row.trustInfoRecordDate
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="到期日期"
          align="center"
          sortable
          width="170"
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.expireDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="traceLink"
          label="追溯链接"
          width="170"
          align="center"
        >
          <template slot-scope="scope">
            <a href="#">{{ scope.row.traceLink }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="180"
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
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addFundDialog
        v-if="addFundDialog.show"
        :isShow="addFundDialog.show"
        :dialogRow="addFundDialog.dialogRow"
        @getFundList="getproductList"
        @closeDialog="hideAddFundDialog"
      ></addFundDialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as mutils from '@/utils/mUtils'
import SearchItem from './components/searchItem'
import AddFundDialog from './components/addFundDialog'
import Pagination from '@/components/pagination'
import { getproduct, deleteData } from '@/api/user'
import { batchremoveMoney } from '@/api/money'
import qs from 'qs'

export default {
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      loading: true,
      idFlag: false,
      isShow: false, // 是否显示资金modal,默认为false
      editid: '',
      rowIds: [],
      sortnum: 0,
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
      addFundDialog: {
        show: false,
        dialogRow: {},
      },
      incomePayData: {
        page: 1,
        limit: 20,
        name: '',
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
    ...mapGetters(['search']),
    getImgBaseUrl() {
      return localStorage.getItem('baseUrl')
    },
  },
  mounted() {
    this.getproductList()
  },
  methods: {
    setAddress(value) {},
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300
      })
    },
    getproductList() {
      const param = {
        page: 0,
        size: 10,
        identifyCode: this.search.identifyCode,
        productName: this.search.productName,
        productNo: this.search.productNo,
      }
      getproduct(param).then((res) => {
        this.loading = false
        this.pageTotal = res.data.totalElements
        this.tableData = res.data.content
      })
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
      this.incomePayData.page = val
      this.getproductList()
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.limit = val
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
      this.addFundDialog.dialogRow = { ...row }
      this.showAddFundDialog()
    },
    // 删除数据
    onDelete(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          const para = { id: row.id }
          deleteData(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.getproductList()
          })
        })
        .catch(() => {})
    },
    onBatchDelItem() {
      this.$confirm('确认批量删除记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          const ids = this.rowIds.map((item) => item.id).toString()
          const para = { ids: ids }
          batchremoveMoney(para).then((res) => {
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
.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>
