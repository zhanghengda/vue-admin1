<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddFundDialog"
      @searchList="getproductList"
      isFilterShow
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
        <el-table-column prop="id" label="序列号" align="center" width="180">
        </el-table-column>

        <el-table-column prop="domain" label="域名" align="center" width="*">
          <template slot-scope="scope">
            <div>
              <a
                target="_Blank"
                :href="scope.row.domain"
                :alt="scope.row.domain"
              >
                {{ scope.row.domain }}
              </a>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="gameCount"
          width="*"
          label="配置游戏数量"
          align="center"
        >
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
            <el-button
              type="warning"
              icon="edit"
              size="mini"
              @click="peizhi(scope.row)"
              >配置游戏</el-button
            >
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
      <domainDialog
        v-if="addFundDialog.show"
        :isShow="addFundDialog.show"
        :dialogRow="addFundDialog.dialogRow"
        @getFundList="getproductList"
        @closeDialog="hideAddFundDialog"
      ></domainDialog>

      <el-dialog
        :title="dialogtitle"
        width="75%"
        height="500px"
        max-height="500px"
        :visible.sync="dialogTableVisible"
      >
        <div>
          <el-table height="400px" :data="gridData">
            <el-table-column
              prop="name"
              label="游戏名称"
              align="center"
              width="*"
            >
            </el-table-column>
            <el-table-column width="100" label="游戏打分" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.star }}分</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="logoUrl"
              width="120"
              label="logo"
              align="center"
            >
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
            <el-table-column prop="tags" width="*" label="标签" align="center">
            </el-table-column>
            <el-table-column
              prop="categorysname"
              width="*"
              label="游戏分类"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="href"
              width="*"
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
              prop="sort"
              width="*"
              label="游戏排序"
              align="center"
            >
              <template slot-scope="scope">
                <div>
                  <el-input type="text" v-model="scope.row.sort"></el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column width="*" label="状态" align="center">
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
          </el-table>

          <!-- <pagination
            :pageTotal="dialogTotal"
            :current-page="dialogData.page"
            :page-size="dialogData.size"
            @handleCurrentChange="dialoghandleCurrentChange"
            @handleSizeChange="dialoghandleSizeChange"
          ></pagination> -->

          <div class="dialog-btnbox">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit()">保 存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as mutils from '@/utils/mUtils'
import SearchItem from './components/searchItem'
import domainDialog from './components/domainDialog'
import Pagination from '@/components/pagination'
import { mgdomainlist, setgamesort, mggamelist, deleteData } from '@/api/user'

let moment = require('moment')

export default {
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      loading: true,
      gridData: [],
      dialogTableVisible: false,
      idFlag: false,
      isShow: false, // 是否显示资金modal,默认为false
      editid: '',
      rowIds: [],
      sortnum: 0,
      dialogtitle: '配置游戏',
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
      domainId: '',
      addFundDialog: {
        show: false,
        dialogRow: {},
      },
      incomePayData: {
        page: 0,
        size: 20,
      },
      dialogData: {
        page: 0,
        size: 200,
      },
      pageTotal: 0,
      dialogTotal: 0,
    }
  },
  components: {
    SearchItem,
    domainDialog,
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
  },
  methods: {
    setAddress(value) {},
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300
      })
    },
    onSubmit() {
      let formData = []
      this.loading = true
      this.gridData.map((t) => {
        let game = {
          domainId: this.domainId,
          gameId: t.id,
          sort: t.sort,
        }
        formData.push(game)
      })

      const para = JSON.stringify(formData)
      setgamesort(para).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })

          this.getgamesList({
            domainId: this.domainId,
          })
        } else {
          this.$message({
            message: res.desc,
            type: 'error',
          })
        }
        this.isVisible = false
      })
    },
    getproductList() {
      const param = {
        pageNum: this.incomePayData.page + 1,
        pageSize: this.incomePayData.size,
        searchKey: '',
      }
      mgdomainlist(param).then((res) => {
        this.loading = false
        this.pageTotal = res.data.total
        this.tableData = res.data.records
      })
    },

    getgamesList() {
      let _this = this
      const param = {
        pageNum: this.dialogData.page + 1,
        pageSize: this.dialogData.size,
        domainId: this.domainId,
      }
      mggamelist(param).then((res) => {
        this.dialogTotal = res.data.total

        if (_this.categorys.length > 0) {
          res.data.records.map((t) => {
            let name = ''
            if (t.categoryId != '') {
              let categoryId = t.categoryId.split(',')
              categoryId.map((id, index) => {
                let n = _this.categorys.find((f) => id == f.id).category
                if (index > 0) name += n + ','
                else name += n
              })
            }

            t.categorysname = name
          })
        }
        this.gridData = res.data.records
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

    // 弹出窗上下分页
    dialoghandleCurrentChange(val) {
      this.dialogData.page = val
      this.getgamesList()
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.size = val
      this.getproductList()
    },
    // 弹出窗每页显示多少条
    dialoghandleSizeChange(val) {
      this.dialogData.size = val
      this.getgamesList()
    },

    peizhi(row) {
      this.dialogTableVisible = true
      this.domainId = row.id
      this.dialogtitle = row.domain + '配置游戏'
      this.getgamesList()
    },
    // 编辑操作方法
    onEdit(row) {
      this.addFundDialog.dialogRow = { ...row }
      this.showAddFundDialog('edit')
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
.dialog-btnbox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>
