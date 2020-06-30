<template>
  <div>
    <Top @callBackSearch="handleSearch" @callBackPageData="handlePage" :totalInfo="total"></Top>
    <el-table
      :data="$options.filters.dataFliter(syslog.filter(log => !search || $options.filters.dateFormat(log.datetime).includes(this.search) || log.level.includes(this.search) || log.facility.includes(this.search) || log.msg.includes(search)),pageData.limit,pageData.currentPage)"
      v-loading="loading"
      :element-loading-text="$t('Loading...')"
    >
      <el-table-column :label="$t('Datetime')" prop="datetime" width="220"></el-table-column>
      <el-table-column :label="$t('Facility-syslog')" prop="facility" width="100"></el-table-column>
      <el-table-column :label="$t('Level')" prop="level" width="100"></el-table-column>
      <el-table-column :label="$t('Message')" prop="msg"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Top from "./top.vue";
export default {
  components: {
    Top
  },
  data() {
    return {
      syslog: [],
      loading: true,
      search: "",
      total: 0,
      pageData: {}
    };
  },
  methods: {
    handleSearch(data) {
      this.search = data;
    },
    handlePage(data) {
      this.pageData = data;
    }
  },
  watch: {
    search() {
      this.total = this.syslog.filter(
        log =>
          !this.search ||
          this.$options.filters
            .dateFormat(log.datetime)
            .includes(this.search) ||
          log.level.includes(this.search) ||
          log.facility.includes(this.search) ||
          log.msg.includes(this.search)
      ).length;
    }
  },
  created() {
    this.$ubus.call("oui.system", "syslog").then(r => {
      this.syslog = r.log;
      this.total = r.log.length;
      this.loading = false;
    });
  }
};
</script>
