<template>
  <div class="fillcontain">
    <div class="table_container">
      <el-table
        :row-style="{ height: '120px', 'max-height': '120px' }"
        style="width: 100%"
        align="center"
        :data="gridData"
      >
        <el-table-column prop="name" label="游戏名称" align="center" width="*">
        </el-table-column>
        <el-table-column width="100" label="游戏打分" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.star }}分</div>
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
        <el-table-column prop="tags" width="*" label="标签" align="center">
        </el-table-column>
        <el-table-column
          prop="categorysname"
          width="*"
          label="游戏分类"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="href" width="*" label="游戏链接" align="center">
          <template slot-scope="scope">
            <div class="href-box">
              {{ scope.row.href }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="sort" width="*" label="游戏排序" align="center">
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

      <div class="dialog-btnbox">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>

      <pagination
        :pageTotal="pageTotal"
        :paginations="paginations"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
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

      domainId: '',
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

      dialogData: {
        page: 0,
        size: 200,
      },
      pageTotal: 0,
      dialogTotal: 0,
    }
  },
  components: {
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
    this.getgamesList()
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
        pageNum: this.paginations.pageIndex,
        pageSize: this.paginations.pageSize,
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
        pageNum: this.paginations.pageIndex,
        pageSize: this.paginations.pageSize,
        domainId: this.$route.query.domainId,
      }
      mggamelist(param).then((res) => {
        this.dialogTotal = res.data.total

        if (_this.categorys.length > 0) {
          res.data.records.map((t) => {
            let name = ''
            if (t.categoryId != '') {
              let categoryId = t.categoryId.split(',')
              categoryId.map((id, index) => {
                let n = _this.categorys.find((f) => id == f.id)
                if (index > 0) name += (n ? n.category : '') + ','
                else name += n ? n.category : ''
              })
            }

            t.categorysname = name
          })
        }
        this.gridData = res.data.records
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
      this.paginations.pageIndex = val
      this.getgamesList()
    },

    // 每页显示多少条
    handleSizeChange(val) {
      this.paginations.pageSize = val
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
