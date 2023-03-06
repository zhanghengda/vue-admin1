<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddFundDialog"
      @searchList="getproductList"
      isFilterShow
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
        <el-table-column prop="id" label="分类ID" align="center" width="180">
        </el-table-column>
        <el-table-column
          prop="category"
          label="类别名称"
          align="center"
          width="*"
        >
        </el-table-column>

        <el-table-column prop="sort" width="*" label="排序" align="center">
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
            <!-- <el-button
              type="danger"
              icon="delete"
              size="mini"
              @click="onEdit(scope.row)"
              >配置 游戏</el-button
            > -->
            <!-- <el-button
              type="danger"
              icon="delete"
              size="mini"
              @click="onDelete(scope.row, scope.$index)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        :current-page="incomePayData.page"
        :page-size="incomePayData.size"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addClassify
        v-if="addFundDialog.show"
        :isShow="addFundDialog.show"
        :dialogRow="addFundDialog.dialogRow"
        @getFundList="getproductList"
        @closeDialog="hideAddFundDialog"
      ></addClassify>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as mutils from '@/utils/mUtils'
import SearchItem from './components/searchItem'
import addClassify from './components/addClassify'
import Pagination from '@/components/pagination'
import { categorylist, categorydel } from '@/api/user'

let moment = require('moment')

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
        page: 0,
        size: 20,
        name: '',
      },
      pageTotal: 0,
    }
  },
  components: {
    SearchItem,
    addClassify,
    Pagination,
  },
  computed: {
    ...mapGetters(['search']),
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
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.size,
        searchKey: '',
        // catetoryId:'',
        // status:'',
        // domainId:'',
        // domainId:'',
      }
      categorylist(param).then((res) => {
        this.loading = false
        this.pageTotal = res.data.total
        this.tableData = res.data.records
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
      console.log('val', val)
      this.getproductList()
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.size = val
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
      this.showAddFundDialog('edit')
    },
    // 删除数据
    onDelete(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          let id = row.id + ''
          const para = { paramIds: [id] }
          categorydel(para).then((res) => {
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
