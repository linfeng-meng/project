<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />
  </v-app>
</template>

<script>
export default {
  name: "Layout",

  components: {
    DashboardCoreAppBar: () => import("./AppBar"),
    DashboardCoreDrawer: () => import("./Drawer"),
    DashboardCoreView: () => import("./View")
  },

  data: () => ({
    expandOnHover: false
  }),
  computed: {
    hostname() {
      return this.$store.state.hostname;
    }
  },
  watch: {
    hostname() {
      document.title = this.hostname;
    }
  },
  created() {
    this.$system.getBoardInfo().then(r => {
      this.$store.commit("setHostname", r.hostname);
    });
  }
};
</script>
