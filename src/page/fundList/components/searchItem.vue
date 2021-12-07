<template>
  <div class="search_container searchArea">
    <el-form
      :inline="true"
      :model="search_data"
      :rules="rules"
      ref="search_data"
      class="demo-form-inline search-form"
    >
      <el-form-item label="">
        <el-input
          v-model="search_data.productName"
          placeholder="产品名称"
          @keyup.enter.native="onSearch('search_data')"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model="search_data.productNo"
          placeholder="溯源号码"
          @keyup.enter.native="onSearch('search_data')"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model="search_data.identifyCode"
          placeholder="防伪码"
          @keyup.enter.native="onSearch('search_data')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="search"
          @click="onSearch('search_data')"
          >筛选</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="search"
          @click="onClearSearch('search_data')"
          >清除</el-button
        >
      </el-form-item>

      <el-form-item class="btnRight">
        <el-button
          type="primary"
          size="mini"
          icon="view"
          @click="onBatchDelItem()"
          :disabled="searchBtnDisabled"
          >批量删除</el-button
        >
        <!-- <el-button type="success" size ="mini" icon="view">导出Elcel</el-button> -->
        <el-button type="primary" size="mini" icon="view" @click="onAddNew()"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'searchItem',
  data() {
    return {
      search_data: {
        productName: '',
        productNo: '',
        identifyCode: '',
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters(['searchBtnDisabled']),
  },
  created() {},
  methods: {
    onSearch(searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          this.$store.commit('SET_SEARCH', this.search_data)
          this.$emit('searchList')
        }
      })
    },
    onClearSearch() {
      this.search_data = {
        productName: '',
        productNo: '',
        identifyCode: '',
      }
      this.$store.commit('SET_SEARCH', this.search_data)
      this.$emit('searchList')
    },
    onAddNew() {
      this.$emit('showDialog', 'add')
    },
    onBatchDelItem() {
      this.$emit('onBatchDelItem')
    },
  },
}
</script>

<style lang="less" scoped>
.search_container {
  margin-bottom: 20px;
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
