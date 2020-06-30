<template>
  <div class="top">
    <el-input
      v-model="search"
      size="small"
      :placeholder="$t('Enter keywords to filter')"
      style=" width: 200px;"
    />
    <div v-show="!$store.state.isMobile" class="top-right">
      <el-pagination
        background
        layout="total,sizes,prev, pager, next"
        :page-size="pageData.limit"
        :pager-count = "5"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="pageData.currentPage"
        :page-sizes="[10, 20, 30]"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Top",
  props: ["totalInfo"],
  data() {
    return {
      breadcrumbs: [],
      search: "",
      pageData: {
        limit: 10,
        currentPage: 1
      },
      total: this.totalInfo
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageData.limit = val;
    },
    handleCurrentChange(val) {
      this.pageData.currentPage = val;
    }
  },
  watch: {
    totalInfo() {
      this.total = this.totalInfo;
    },
    search() {
      this.$emit("callBackSearch", this.search);
    },
    pageData: {
      handler(newVal) {
        this.$emit("callBackPageData", newVal);
      },
      immediate: true
    }
  },
  created() {}
};
</script>

<style lang="scss">
.top {
  margin: 0 auto;
  padding-bottom: 10px;
  .top-right {
    display: flex;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
