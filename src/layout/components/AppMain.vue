<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
      <router-view :key="key" />
    </keep-alive>
    </transition>
    <copy-right v-if="isEnter" />
  </section>
</template>

<script>
import CopyRight from './CopyRight'
export default {
  name: 'AppMain',
  components: {
    CopyRight
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  data() {
    return {
      isEnter: false
    }
  },
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
