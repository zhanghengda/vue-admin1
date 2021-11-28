<template>
  <section class="data_section" ref="data_section">
    <a :href="github" target="_blank">
      <el-row :gutter="10" class="row_list">
        <el-col :span="8">
          <div class="row_left row_base">
            <el-col :span="12">
              <div class="pay saleBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t('index.yearLoss') }}</p>
                  <p class="number">
                    68<span class="perTitle"
                      >({{ $t('index.tenMillion') }})</span
                    >
                  </p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconfukuan" />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="pay taxBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t('index.yearProfit') }}</p>
                  <p class="number">120<span class="perTitle">(%)</span></p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay3" />
                </div>
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="row_right row_base">
            <el-col :span="6">
              <div class="extenedBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t('index.potentialInvestor') }}</p>
                  <p class="number">
                    686<span class="perTitle">({{ $t('index.person') }})</span>
                  </p>
                  <p class="cardText">Decreased by 10%</p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay2" />
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="likeBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t('index.intentionInvestor') }}</p>
                  <p class="number">
                    1276<span class="perTitle">({{ $t('index.person') }})</span>
                  </p>
                  <p class="cardText">Decreased by 50%</p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay1" />
                </div>
              </div>
            </el-col>
          
          </div>
        </el-col>
      </el-row>
    </a>
   
    </el-row>
  </section>
</template>

<script>
import salesTable from './components/salesTable' // 销售数据表格
import commentList from './components/commentList' // 用户评论列表
import cardList from './components/cardList' // card列表
import { github } from '@/utils/env'

export default {
  data() {
    return {
      github: github,
    }
  },
  components: {
    salesTable,
    commentList,
    cardList,
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="less" scoped>
.data_section {
  margin: 20px;
  border-radius: 2px;
  .row_list {
    margin-bottom: 20px;
    .row_base {
      padding: 10px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 6px;
      height: 120px;
    }
  }
  .order_list {
    .orderArea {
      width: 100%;
      height: 300px;
      background: #fff !important;
      border-radius: 6px;
      box-sizing: border-box;
      padding: 10px;
      padding-top: 40px;
      overflow: hidden;
    }
    .orderbarArea {
      height: 370px;
    }
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    border-radius: 6px;
    padding: 10px;
    color: #fff;
    height: 80px;
    .leftItem {
      align-items: start;
      justify-content: space-between;
      text-align: left;
    }
    .rightItem {
      width: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      .svg-icon {
        font-size: 30px;
      }
    }
    .number {
      font-size: 22px;
      font-weight: bold;
      .perTitle {
        font-size: 13px;
        margin-left: 5px;
      }
    }
  }
  .pay {
    .leftItem {
      justify-content: space-around;
    }
  }
}
</style>
