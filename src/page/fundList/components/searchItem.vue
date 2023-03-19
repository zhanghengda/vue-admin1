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
          v-model="search_data.searchKey"
          placeholder="游戏名称"
          v-if="isGameNameShow"
          @keyup.enter.native="onSearch('search_data')"
        ></el-input>
      </el-form-item>
      <el-form-item label="域名名称" v-if="isSearchShow">
        <el-select v-model="search_data.domainId" placeholder="请选择">
          <el-option
            v-for="item in domains"
            :key="item.id"
            :label="item.domain"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="游戏分类：" v-if="isSearchShow">
        <el-select v-model="search_data.categoryId" placeholder="请选择">
          <el-option
            v-for="item in categorys"
            :key="item.id"
            :label="item.category"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="上架状态">
        <el-select v-model="search_data.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.lable"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="search"
          v-if="isFilterShow"
          @click="onSearch('search_data')"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="search"
          v-if="isSearchShow"
          @click="onClearSearch('search_data')"
          >清除</el-button
        >
      </el-form-item>

      <el-form-item class="btnRight">
        <el-button
          type="primary"
          size="mini"
          icon="view"
          v-if="isExportShow"
          @click="onExportItem()"
          >导入游戏</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="view"
          v-if="isAllShow"
          @click="onBatchUpItem(1)"
          :disabled="searchBtnDisabled"
          >批量上线</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="view"
          v-if="isAllShow"
          @click="onBatchUpItem(2)"
          :disabled="searchBtnDisabled"
          >批量下线</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="view"
          v-if="isTagShow"
          @click="onBatchtagItem()"
          :disabled="searchBtnDisabled"
          >批量打标签</el-button
        >

        <el-button
          type="primary"
          size="mini"
          icon="view"
          v-if="isAllShow"
          @click="onBatchDelItem()"
          :disabled="searchBtnDisabled"
          >批量删除</el-button
        >
        <el-button
          type="success"
          size="mini"
          v-if="isDownShow"
          @click="todownloadtemplate"
          icon="view"
          >下载模板</el-button
        >
        <el-button type="primary" size="mini" icon="view" @click="onAddNew()"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mggameupdate, mggameadd, mgdomainlist, categorylist } from '@/api/user'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'searchItem',
  props: {
    isAllShow: Boolean,
    isGameNameShow: Boolean,
    isGameUrlShow: Boolean,
    isGameCatetoryShow: Boolean,
    isGameStatusShow: Boolean,
    isFilterShow: Boolean,
    isSearchShow: Boolean,
    isSearchShow: Boolean,
    isDownShow: Boolean,
    isUpShow: Boolean,
    isTagShow: Boolean,
    isExportShow: Boolean,
    isDomainShow: Boolean,
  },
  data() {
    return {
      search_data: {
        productName: '',
        productNo: '',
        categoryId: '',
        domainId: '',
        identifyCode: '',
      },
      domains: [],
      categorys: [],
      statusList: [
        {
          id: -1,
          value: -1,
          lable: '全部',
        },
        {
          id: 0,
          value: 0,
          lable: '草稿',
        },
        {
          id: 1,
          value: 1,
          lable: '已上架',
        },
        {
          id: 2,
          value: 2,
          lable: '已下架',
        },
      ],
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters(['searchBtnDisabled']),
  },
  created() {
    this.oncategorylist()
    this.getdomainList()
  },
  methods: {
    ...mapMutations({
      SET_CATEGORYS: 'user/SET_CATEGORYS',
    }),
    onSearch(searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          this.$store.commit('SET_SEARCH', this.search_data)
          this.$emit('searchList')
        }
      })
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
    getdomainList() {
      const param = {
        pageNum: 0,
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
    onClearSearch() {
      this.search_data = {
        productName: '',
        productNo: '',
        identifyCode: '',
      }
      this.$store.commit('SET_SEARCH', this.search_data)
      this.$emit('searchList')
    },
    todownloadtemplate() {
      this.$emit('todownloadtemplate')
    },
    onAddNew() {
      this.$emit('showDialog', 'add')
    },
    onBatchDelItem() {
      this.$emit('onBatchDelItem')
    },
    onBatchUpItem(type) {
      this.$emit('onBatchUpItem', type)
    },
    onExportItem() {
      this.$emit('onExportItem')
    },
    onBatchtagItem() {
      this.$emit('onBatchtagItem')
    },
  },
}
</script>

<style lang="less" scoped>
.search_container {
  height: 100%;
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
