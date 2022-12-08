<template>
  <div class="dashboard-container">
    <Card></Card>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

import Card from './Card'

export default {
  name: 'Dashboard',
  components:{Card},
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 5px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
