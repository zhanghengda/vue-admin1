<template>
  <div class="fillcontain">
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column
          prop="name"
          label="反馈人姓名"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          align="center"
          width="80"
        >
        </el-table-column>

        <el-table-column prop="email" width="180" label="邮箱" align="center">
        </el-table-column>
        <el-table-column
          width="180"
          prop="content"
          label="产品备注"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="反馈日期"
          align="center"
          sortable
          width="170"
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px"></span>
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
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/pagination'
import { consumerFeedback } from '@/api/user'

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pageTotal: 0,
      incomePayData: {
        page: 1,
        limit: 20,
        name: '',
      },
    }
  },
  components: {
    Pagination,
  },
  created() {
    this.getFeedbackList()
  },
  mounted() {},
  methods: {
    // 上下分页
    handleCurrentChange(val) {
      this.incomePayData.page = val
      this.getFeedbackList()
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.limit = val
      this.getFeedbackList()
    },
    getFeedbackList() {
      const para = {
        page: 0,
        size: 20,
      }
      consumerFeedback(para).then((res) => {
        this.loading = false
        this.pageTotal = res.data.totalElements
        this.tableData = res.data.content
      })
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
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>
