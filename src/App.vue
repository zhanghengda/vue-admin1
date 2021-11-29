<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { login, baseimgUrl } from '@/api/user'

export default {
  name: 'App',
  methods: {
    getbaseImg() {
      baseimgUrl().then((res) => {
        if (res.code == 0) {
          localStorage.setItem('baseUrl', res.data)
        }
      })
    },
  },
}
</script>

<style lang="less">
@import './style/variables';
@import './style/element-ui';
@import './style/common';
@import './style/scrollBar';
</style>
